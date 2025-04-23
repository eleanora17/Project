import subprocess
import time
import logging
import sys
import os

# Set up logging
logging.basicConfig(
    filename='flask_output.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def start_flask():
    logging.info("Starting Flask app subprocess...")
    process = subprocess.Popen(
        [sys.executable, __file__, "flask"],  # Re-run this file with "flask" argument
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    return process

def run_watcher():
    while True:
        process = start_flask()
        logging.info(process.pid)
        with open("flask_app.pid", "w") as f:
            f.write(str(os.getpid()))

        # Wait for Flask process to exit
        stdout, stderr = process.communicate()

        # Log any output/errors
        if stdout:
            logging.info(stdout.decode())
        if stderr:
            logging.error(stderr.decode())

        logging.warning("Flask app crashed. Restarting in 3 seconds...")
        time.sleep(3)

def run_flask_app():
    from app import create_app
    from waitress import serve

    try:
        app = create_app()
        serve(app, host='127.0.0.1', port=5000)
    except Exception as e:
        logging.exception("Flask app crashed with exception")
        raise

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "flask":
        run_flask_app()
    else:
        run_watcher()


# from app import create_app
# import os

# app = create_app()
# port = 5000
# pid_file = "flask_app.pid"

# def run_flask():
#     """Runs Flask in the background and saves its PID."""
#     app.config.from_object('config.config.ProductionConfig')
#     port = app.config.get("APP_PORT", 5000)

#     # Store PID to stop it later
#     pid = os.getpid()
#     with open(pid_file, "w") as f:
#         f.write(str(pid))

#     print(f"Flask is running on port {port}. PID: {pid}")
    
#     app.run(debug=False, use_reloader=False, port=port)

# if __name__ == "__main__":
#     run_flask()
