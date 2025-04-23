import os
import signal

pid_file = "flask_app.pid"

if os.path.exists(pid_file):
    with open(pid_file, "r") as f:
        pid = int(f.read().strip())

    os.kill(pid, signal.SIGTERM)  # Gracefully stop Flask
    os.remove(pid_file)
    print("Flask app stopped.")
else:
    print("No running Flask app found.")
