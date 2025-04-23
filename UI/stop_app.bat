@echo off
cd /d "%~dp0"
echo Stopping Flask and WebView...

REM Stop Flask using the stored PID
if exist ..\..\flask_app.pid (
    for /f "tokens=*" %%i in (..\..\flask_app.pid) do taskkill /F /PID %%i
    del ..\..\flask_app.pid
    echo Flask stopped.
) else (
    echo No running Flask instance found.
)

REM Stop WebView (kill all Python processes running it)
taskkill /F /IM python.exe /T >nul 2>&1
echo WebView stopped.

echo App fully stopped.
exit /b
