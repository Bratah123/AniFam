:: Turn ECHO off
@echo off
setlocal

echo This script will launch the Flask server using the virtual environment
echo See README.md for initial set-up
echo Please select the environment to run the source code with:
echo A: Production Environment (Default)
echo B: Development Environment
choice /c AB /t 10 /d A /m "What is your choice"
if errorlevel 2 call :dev
if errorlevel 1 call :prod
pause
endlocal

:prod
echo You have selected A: Production Environment
venv\scripts\python api\index.py
:: venv\scripts\waitress-serve --host 127.0.0.1 --port=5328 api.wsgi:app
:: default 4 threads, see https://docs.pylonsproject.org/projects/waitress/en/stable/runner.html
exit \b

:dev
echo You have selected B: Development Environment
venv\scripts\python api\index.py --dev_mode
exit \b