@echo off
cd /d "%~dp0"

REM Handle restart
if "%1"=="restart" (
    echo Restarting application...
    call "%~f0" stop
    call "%~f0"
    exit /b
)

REM Handle stop
if "%1"=="stop" (
    echo Stopping Flask and WebView...

    REM Stop Flask using the stored PID
    if exist flask_app.pid (
        for /f "tokens=*" %%i in (flask_app.pid) do taskkill /F /PID %%i
        del flask_app.pid
        echo Flask stopped.
    ) else (
        echo No running Flask instance found.
    )

    REM Stop WebView (kill all Python processes running it)
    taskkill /F /IM python.exe /T >nul 2>&1
    echo WebView stopped.

    echo App fully stopped.
    exit /b
)

REM Before starting, check if Flask is already running and kill it
if exist flask_app.pid (
    echo Killing existing Flask process...
    for /f "tokens=*" %%i in (flask_app.pid) do taskkill /F /PID %%i
    del flask_app.pid
)

echo Starting Flask...
start /b python run.py > flask.log 2>&1

REM Wait for Flask to be ready
echo Waiting for Flask to start...
:check_flask
timeout /t 1 /nobreak >nul
curl -s http://127.0.0.1:5000 >nul
if %ERRORLEVEL% neq 0 goto check_flask

echo Flask is running.

REM If "wv" argument was passed, start WebView
if "%1"=="wv" (
    echo Starting WebView...
    start /b python run_webview.py
    echo WebView started.
)

exit /b
