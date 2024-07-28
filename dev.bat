@echo off
start "docker" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
:wait_for_docker
timeout /t 2 /nobreak >nul
docker info >nul 2>&1
if errorlevel 1 (
    echo Waiting for Docker to start...
    goto wait_for_docker
)
start "dev:server" cmd /k "docker-compose -p terminal_chat up -d --build && cd server && npm i && npm run dev"
start "dev:client" cmd /k "cd client && npm i && npm run dev"