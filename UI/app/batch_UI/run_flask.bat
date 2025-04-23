@echo off
cd /d "%~dp0"
echo Starting Flask

REM Start app in the background and store the PID
start /b python run.py > flask.log 2>&1
echo %! > flask_app.pid

echo Flask is running in the background. Check flask.log for logs.
exit
