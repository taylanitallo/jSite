@echo off
echo Reiniciando servidores...

echo.
echo [1/2] Encerrando processos Node na porta 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo [2/2] Iniciando servidor de desenvolvimento...
cd /d "%~dp0"
start "" cmd /k "npm run dev"

echo.
echo Servidor iniciado em http://localhost:5173
