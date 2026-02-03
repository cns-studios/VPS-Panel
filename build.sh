#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status.

echo "[1/3] Building the base VPS SSH image (vps-ssh-image)..."
docker build -t vps-ssh-image -f ./backend/Dockerfile.vps ./backend

echo "\n[2/3] Building the backend image (vps-management-backend)..."
docker build -t vps-management-backend -f ./backend/Dockerfile ./backend

echo "\n[3/3] Building the frontend image (vps-management-frontend)..."
docker build -t vps-management-frontend -f ./frontend/Dockerfile ./frontend

echo "\nBuild complete! All images have been created successfully."
echo "You can now start the application by running: docker compose up"
