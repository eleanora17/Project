@echo off
if exist flask_app.pid (
    for /f "tokens=*" %%i in (flask_app.pid) do taskkill /PID %%i /F
    del flask_app.pid
    echo Flask app stopped.
) else (
    echo No running Flask app found.
)
exit
