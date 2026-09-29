@echo off
REM Meta-Prompt Generator - localhost:8080 uzerinde ise salir
cd /d "%~dp0"
start "" http://localhost:8080
where python >nul 2>nul && (python -m http.server 8080) || (npx --yes serve -l 8080 .)
