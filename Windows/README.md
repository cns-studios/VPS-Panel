# VPS Management Panel (Windows Version)

This project provides a simple web-based panel to manage virtual private servers (VPS) running in Docker containers.

## Features

- **Web-based Dashboard:** View and manage all your VPS instances from a clean web interface.
- **Lifecycle Management:** Start, stop, and restart VPS containers directly from the dashboard.
- **One-Click Creation:** Create new, SSH-enabled VPS instances with a single click.
- **Secure SSH Access:** Each VPS gets a unique, automatically assigned port for secure SSH connections.
- **Easy Setup:** Uses Docker Compose for a streamlined setup process.

---

## Setup and Installation

Follow these steps to get the project running on your Windows machine.

### Prerequisites

- **Docker Desktop:** You must have Docker Desktop for Windows installed and running. Make sure it is configured to use the WSL 2 backend for best performance. [Installation Guide](https://docs.docker.com/desktop/install/windows-install/)

### Step 1: Build the Docker Images

I have created a simple batch script to build all the necessary Docker images for you.

Double-click the `build.bat` file, or run the following command in the project root directory from your Command Prompt or PowerShell:

```cmd
.\build.bat
```

This will build the `vps-ssh-image`, the `vps-management-backend`, and the `vps-management-frontend` images.

### Step 2: Start the Application

Once the images are built, you can start all the services using Docker Compose.

```cmd
docker-compose up
```

The `-d` flag can be added to run the containers in the background (detached mode).

### Step 3: Access the Web Panel

Your VPS Management Panel is now running!

-   Open your web browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## Usage

-   **Create a VPS:** Click the "+ Create New VPS" button.
-   **Manage a VPS:** Use the Start, Stop, and Restart buttons for each instance.
-   **Connect via SSH:** The dashboard provides the exact SSH command to connect to your running VPS. The credentials are:
    -   **Username:** `vpsuser`
    -   **Password:** `password`

    Example command:
    ```bash
    ssh vpsuser@localhost -p 32768
    ```
