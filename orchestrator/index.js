const express = require('express');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const JOBS = {};

app.use(express.json());

const jobsDir = path.join(__dirname, 'jobs');
try {
    if (!fs.existsSync(jobsDir)) {
        fs.mkdirSync(jobsDir, { recursive: true });
    }
} catch (error) {
    console.error(`Error creating jobs directory: ${jobsDir}`, error);
    process.exit(1);
}

app.post('/schedule', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }

    const jobId = uuidv4();
    JOBS[jobId] = { status: 'pending', result: null, containerId: null, error: null };

    const jobDir = path.join(jobsDir, jobId);
    try {
        fs.mkdirSync(jobDir);
        fs.writeFileSync(path.join(jobDir, 'task.txt'), task);
    } catch (error) {
        JOBS[jobId].status = 'failed';
        JOBS[jobId].error = `Failed to create job directory or task file: ${error.message}`;
        return res.status(500).json({ error: JOBS[jobId].error });
    }

    const escapedJobDir = jobDir.replace(/\\/g, '/');

    const dockerCmd = [
        'docker run --rm',
        `-v "${escapedJobDir}:/app/context"`,
        '--name',
        `agent-job-${jobId}`,
        'my-agent-image',
    ].join(' ');

    console.log(`Executing Docker command for job ${jobId}: ${dockerCmd}`);
    JOBS[jobId].status = 'running';

    exec(dockerCmd, (err, stdout, stderr) => {
        if (err) {
            console.error(`Job ${jobId} failed to start/run:`, stderr || err.message);
            JOBS[jobId].status = 'failed';
            JOBS[jobId].error = stderr || err.message;
        } else {
            const containerId = stdout.trim();
            JOBS[jobId].containerId = containerId;
            console.log(`Job ${jobId} Docker container started: ${containerId}`);

            setTimeout(() => {
                if (JOBS[jobId].status === 'running') {
                    JOBS[jobId].status = 'complete';
                    JOBS[jobId].result = `/jobs/${jobId}/output.zip`;
                    console.log(`Job ${jobId} marked as complete (after timeout).`);
                }
            }, 30000);
        }
    });

    res.json({ job_Id: jobId });
});

app.get('/status/:id', (req, res) => {
    const job = JOBS[req.params.id];
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
});

app.use('/jobs', express.static(jobsDir));

app.listen(PORT, () => {
    console.log(`Orchestrator is running on port ${PORT}`);
});