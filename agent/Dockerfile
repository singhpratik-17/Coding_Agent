# Use a specific version of Ubuntu for reproducibility
FROM ubuntu:22.04

# --- Optimization and Stability for apt-get ---
# Set DEBIAN_FRONTEND to noninteractive to prevent apt-get from prompting for input
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies in a single RUN layer for efficiency and smaller image size.
# --no-install-recommends: Reduces image size by not installing recommended packages.
# apt-get clean && rm -rf /var/lib/apt/lists/*: Cleans up cached package files
# immediately after installation, ensuring a smaller final image.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nodejs npm python3 python3-pip \
    x11vnc xvfb fluxbox xdotool \
    git curl wget supervisor && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Jupyter (for code execution context)
RUN pip3 install notebook jupyterlab

# Install novnc
# Use specific git clone depths if you only need the latest version to save space/time
RUN git clone https://github.com/novnc/noVNC.git /opt/novnc && \
    git clone https://github.com/novnc/websockify /opt/novnc/utils/websockify

# Set up agent code
WORKDIR /app
# COPY . /app/  <-- Reverting this if your Dockerfile is not in the root of your project
# If your Dockerfile is in `agent/` and your actual agent code is also in `agent/`,
# then use `COPY . /app/` as it was in your previous, working example.
# If your agent code is in a *subfolder* of the context (e.g., `my-agent-project/agent-code`),
# and your Dockerfile is in `my-agent-project/Dockerfile.prod`, then you'd use `COPY agent-code/ /app/`
# For consistency with your earlier successful build context, let's assume `COPY . /app/` is correct
# if the Dockerfile is in the same directory as the agent's package.json.
COPY . /app/
# npm install || true : This is okay if you want the build to continue even if npm install fails.
# However, if npm install is critical, you might want it to fail the build.
# Keeping it for now as you had it.
RUN npm install || true

# Expose ports
EXPOSE 5900 6080 8888 3001

# Startup script
COPY agent_start.sh /agent_start.sh
RUN chmod +x /agent_start.sh

# Use the absolute path for the CMD to be explicit
CMD ["/agent_start.sh"]