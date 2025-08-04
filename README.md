
# 🚀 Coding Agent with Sandboxing & Orchestration

A containerized coding agent system with sandboxing, orchestration layer, and context management. Built with Docker, Node.js/Express, and featuring VNC/Jupyter access for real-time interaction.

## 🎯 Features

- **🛡️ Sandboxed Environment**: Docker containers with isolated execution
- **🎮 GUI Access**: VNC server with noVNC web client
- **💻 Code Execution**: Jupyter notebooks for Python/TypeScript
- **📁 Context Management**: File-based state persistence with pruning
- **⚡ Orchestration**: Express server for job scheduling and monitoring
- **🔧 Development Tools**: xdotool for GUI automation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Orchestrator  │    │   Agent         │    │   Context       │
│   (Express)     │───▶│   (Docker)      │───▶│   (Mounted)     │
│   Port: 3001    │    │   VNC: 6080     │    │   /app/context  │
│                 │    │   Jupyter: 8888  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker
- Node.js (v14+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/coding-agent.git
cd coding-agent
```

### 2. Build the Agent Image
```bash
docker build -t my-agent-image ./agent
```

### 3. Start the Orchestrator
```bash
cd orchestrator
npm install
node index.js
```

### 4. Schedule a Job
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"task":"Build me a todo app"}' \
  http://localhost:3000/schedule
```

### 5. Access the Agent
- **VNC (GUI)**: http://localhost:6080
- **Jupyter**: http://localhost:8888

## 📋 API Endpoints

### POST /schedule
Schedule a new coding task.

**Request:**
```json
{
  "task": "Build me a React todo application"
}
```

**Response:**
```json
{
  "job_id": "uuid-here"
}
```

### GET /status/:id
Get the status of a scheduled job.

**Response:**
```json
{
  "status": "running|complete|failed",
  "result": "/jobs/uuid/output.zip",
  "error": "error message (if failed)"
}
```

## 🛠️ Tools Provided

### 1. Shell
- Execute shell commands in isolated Docker container
- Full Linux environment with development tools

### 2. Code Execution
- Jupyter notebooks for Python/TypeScript
- Interactive development environment
- Real-time code execution and debugging

### 3. xdot
- GUI control via xdotool
- Automated UI interactions
- Screen capture and manipulation

### 4. Filesystem
- Create, edit, move files
- Mounted volumes for persistent context
- File-based state management

## 🔧 Container Setup

The agent container includes:

- **Display Server**: Xvfb + Fluxbox
- **VNC Access**: x11vnc + noVNC
- **Development Tools**: Node.js, Python, Git
- **Code Execution**: Jupyter Lab
- **GUI Automation**: xdotool

## 📊 Context Management

- **File-based Storage**: Context saved to mounted volumes
- **Automatic Pruning**: Removes old context files
- **Task Persistence**: Tasks saved as text files
- **Output Management**: Generated code zipped and served

## 🔒 Security Features

- **Container Isolation**: Each job runs in separate Docker container
- **Resource Limits**: Docker resource constraints
- **Network Isolation**: Containerized networking
- **File System Isolation**: Mounted volumes for data exchange

## 🚀 Scaling Options

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coding-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: coding-agent
  template:
    metadata:
      labels:
        app: coding-agent
    spec:
      containers:
      - name: agent
        image: my-agent-image
        ports:
        - containerPort: 6080
        - containerPort: 8888
```

### Docker Compose
```yaml
version: '3.8'
services:
  orchestrator:
    build: ./orchestrator
    ports:
      - "3001:3001"
    volumes:
      - ./jobs:/app/jobs
  
  agent:
    build: ./agent
    ports:
      - "6080:6080"
      - "8888:8888"
```

## 🧪 Testing

### Test Different Task Types
```bash
# Todo app
curl -X POST -H "Content-Type: application/json" \
  -d '{"task":"Build me a todo app"}' \
  http://localhost:3001/schedule

# React app
curl -X POST -H "Content-Type: application/json" \
  -d '{"task":"Create a React todo application"}' \
  http://localhost:3001/schedule

# Python app
curl -X POST -H "Content-Type: application/json" \
  -d '{"task":"Build a Python GUI todo app"}' \
  http://localhost:3001/schedule
```

## 📁 Project Structure

```
coding-agent/
├── agent/
│   ├── Dockerfile          # Agent container definition
│   └── agent_start.sh      # Container startup script
├── orchestrator/
│   ├── index.js            # Express orchestration server
│   ├── package.json        # Node.js dependencies
│   └── jobs/               # Job outputs (auto-created)
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## 🔧 Development

### Adding New Tools
1. Update `agent/Dockerfile` to install new dependencies
2. Modify `agent/agent_start.sh` to start new services
3. Rebuild the Docker image

### Extending the Orchestrator
1. Add new endpoints in `orchestrator/index.js`
2. Implement additional job types
3. Add authentication/authorization

### Context Management
- Context files are stored in `/app/context` (mounted volume)
- Implement pruning logic in agent code
- Add summarization for large context files

## 🐛 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check Docker logs
docker logs <container-id>

# Verify image exists
docker images | grep my-agent-image
```

**VNC not accessible:**
- Ensure port 6080 is exposed
- Check if noVNC proxy is running
- Verify Xvfb is started

**Jupyter not accessible:**
- Check port 8888 is exposed
- Verify Jupyter Lab is running
- Check container logs for errors

### Debug Mode
```bash
# Run container in interactive mode
docker run -it --rm -v /tmp:/app/context my-agent-image bash

# Check running processes
ps aux

# Test VNC connection
x11vnc -display :1 -forever -nopw -shared -rfbport 5900
```

## 📈 Performance Optimization

- **Image Size**: Use multi-stage builds
- **Startup Time**: Optimize Dockerfile layers
- **Memory Usage**: Set resource limits
- **Context Size**: Implement aggressive pruning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [noVNC](https://github.com/novnc/noVNC) for web VNC client
- [Jupyter](https://jupyter.org/) for code execution environment
- [Docker](https://www.docker.com/) for containerization

---
