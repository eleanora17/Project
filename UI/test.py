
from app import create_app
import os

app = create_app()
port = 5000
pid_file = "flask_app.pid"

def run_flask():
    """Runs Flask in the background and saves its PID."""
    app.config.from_object('config.config.ProductionConfig')
    port = app.config.get("APP_PORT", 5000)

    # Store PID to stop it later
    pid = os.getpid()
    with open(pid_file, "w") as f:
        f.write(str(pid))

    print(f"Flask is running on port {port}. PID: {pid}")
    
    app.run(debug=False, use_reloader=False, port=port)

if __name__ == "__main__":
    run_flask()
