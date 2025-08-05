# VPS Management Panel

![Dashboard Screenshot](https://i.imgur.com/YOUR_SCREENSHOT_URL.png) <!-- TODO: Add a real screenshot -->

A simple, self-hosted, web-based panel to manage virtual private servers (VPS) running in Docker containers. This project provides a user-friendly interface to create, manage, and connect to your containerized environments, inspired by the functionality of services like Hostinger.

This repository contains two versions of the application, tailored for different host operating systems:
-   **`vps-management-panel/`**: For Linux hosts.
-   **`Windows/`**: For Windows hosts using Docker Desktop.

---

## Features

-   **Web-based Dashboard:** View and manage all your VPS instances from a clean web interface.
-   **One-Click Creation:** Create new, SSH-enabled VPS instances with a single click.
-   **Lifecycle Management:** Start, stop, and restart VPS containers directly from the dashboard.
-   **Secure SSH Access:** Each VPS gets a unique, automatically assigned port for secure SSH connections.
-   **Easy Setup:** Uses Docker Compose and simple build scripts for a streamlined setup process.
-   **Cross-Platform:** Includes dedicated setup instructions for both Linux and Windows.

---

## Technology Stack

-   **Frontend:** React.js with Bootstrap for styling.
-   **Backend:** Node.js with Express.js.
-   **Containerization:** Docker & Docker Compose.
-   **Docker Engine API:** `dockerode` library for interacting with the Docker daemon.

---

## Installation

Please follow the instructions for your host operating system.

### For Linux Users

All the necessary files are located in the `vps-management-panel/` directory.

**1. Configure Docker Permissions (Crucial Step)**

The backend service needs permission to communicate with the Docker engine. You must give the container the correct group ID.

-   Find the Group ID (GID) of the `docker` group on your system:
    ```bash
    getent group docker
    ```
-   This will output something like `docker:x:969:your_username`. The number (e.g., `969`) is your Docker GID.
-   Open the `vps-management-panel/docker-compose.yml` file. Find the `group_add` section and replace the default value with **your** GID.
    ```yaml
    # In vps-management-panel/docker-compose.yml
    group_add:
      - "969" # <-- IMPORTANT: Replace 969 with your Docker GID
    ```

**2. Build the Docker Images**

Navigate to the Linux project directory and run the provided build script. This will build all necessary images.

```bash
cd vps-management-panel
chmod +x build.sh
./build.sh
```

**3. Start the Application**

Once the images are built, start the services using Docker Compose:

```bash
docker compose up
```

### For Windows Users

All the necessary files are located in the `Windows/` directory.

**1. Prerequisites**

-   Ensure you have **Docker Desktop for Windows** installed and running, preferably using the WSL 2 backend.

**2. Build the Docker Images**

Navigate to the Windows project directory and run the provided build script. This will build all necessary images.

```cmd
cd Windows
.\build.bat
```

**3. Start the Application**

Once the images are built, start the services using Docker Compose:

```cmd
docker-compose up
```

---

## Usage

Once the application is running, regardless of your OS:

1.  **Access the Web Panel:** Open your web browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

2.  **Create a VPS:** Click the "+ Create New VPS" button.

3.  **Manage a VPS:** Use the Start, Stop, and Restart buttons for each instance.

4.  **Connect via SSH:** The dashboard provides the exact SSH command to connect to your running VPS. The credentials are:
    -   **Username:** `vpsuser`
    -   **Password:** `password`

    *Example command (the port will be different for you):*
    ```bash
    ssh vpsuser@localhost -p 32768
    ```
