@echo off
cd /d "%~dp0"

echo Verificando alteracoes...
git status

echo.
set /p MSG="Mensagem do commit: "

if "%MSG%"=="" (
    echo Mensagem nao pode ser vazia.
    pause
    exit /b 1
)

git add .
git commit -m "%MSG%"
git push

echo.
echo Commit realizado e enviado com sucesso!
pause
