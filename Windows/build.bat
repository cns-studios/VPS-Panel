@echo off
REM
REM This script simplifies the build process for the VPS Management Panel on Windows.
REM It builds the three required Docker images in the correct order.

ECHO [1/3] Building the base VPS SSH image (vps-ssh-image)...
docker build -t vps-ssh-image -f .\backend\Dockerfile.vps .\backend

ECHO.
ECHO [2/3] Building the backend image (vps-management-backend)...
docker build -t vps-management-backend -f .\backend\Dockerfile .\backend

ECHO.
ECHO [3/3] Building the frontend image (vps-management-frontend)...
docker build -t vps-management-frontend -f .\frontend\Dockerfile .\frontend

ECHO.
ECHO Build complete! All images have been created successfully.
ECHO You can now start the application by running: docker-compose up
