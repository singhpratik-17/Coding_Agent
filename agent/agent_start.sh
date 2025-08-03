#!/bin/bash
set -e

# Start Xvfb (virtual display)
Xvfb :1 -screen 0 1280x800x16 &

# Start Fluxbox window manager
fluxbox -display :1 &

# Start x11vnc for VNC access
x11vnc -display :1 -forever -nopw -shared -rfbport 5900 &

# Start noVNC (web VNC client)
cd /opt/novnc
./utils/novnc_proxy --vnc localhost:5900 --listen 6080 &

# Start Jupyter Lab
jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root --NotebookApp.token='' --NotebookApp.password='' --NotebookApp.allow_origin='*' --NotebookApp.disable_check_xsrf=True &

wait