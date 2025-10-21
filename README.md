# VPS Management Panel

![Dashboard Screenshot](https://i.imgur.com/9d4AVo9.png)

A simple, self-hosted, web-based panel to manage virtual private servers (VPS) running in Docker containers. This project provides a user-friendly interface to create, manage, and connect to your containerized environments, inspired by the functionality of services like Hostinger.

---

## Features

-   **Web-based Dashboard:** View and manage all your VPS instances from a clean web interface.
-   **One-Click Creation:** Create new, SSH-enabled VPS instances with a single click.
-   **Lifecycle Management:** Start, stop, restart, and delete VPS containers directly from the dashboard.
-   **Secure SSH Access:** Each VPS gets a unique, automatically assigned port for secure SSH connections.
-   **Easy Setup:** Uses Docker Compose and simple build scripts for a streamlined setup process.
-   **Cross-Platform:** Clear setup instructions for both Linux and Windows.

---

## Technology Stack

-   **Frontend:** React.js with Bootstrap for styling.
-   **Backend:** Node.js with Express.js.
-   **Containerization:** Docker & Docker Compose.
-   **Docker Engine API:** `dockerode` library for interacting with the Docker daemon.

---

## Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

-   **Docker:** You must have Docker installed and running.
    -   On **Linux**, follow the [official installation guide](https://docs.docker.com/engine/install/).
    -   On **Windows**, install [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/).
-   **Docker Compose:** Included with Docker Desktop. Linux users may need to [install it separately](https://docs.docker.com/compose/install/).

### Step 1: Platform-Specific Configuration

**For Linux Users:**

The backend service needs permission to communicate with the Docker engine. You must provide your Docker group's Group ID (GID) to the container.

1.  Find your Docker GID by running:
    ```bash
    getent group docker
    ```
2.  This will output something like `docker:x:969:your_username`. The number (e.g., `969`) is your GID.
3.  Open the `docker-compose.yml` file. Find the `group_add` section and uncomment it, replacing `"YOUR_DOCKER_GID"` with your actual GID.
    ```yaml
    # In docker-compose.yml
    # group_add:
    #   - "YOUR_DOCKER_GID" # <-- Uncomment and replace with your GID
    ```

**For Windows Users:**

No special configuration is needed. Docker Desktop handles the connection to the Docker daemon automatically.

### Step 2: Build the Docker Images

A build script is provided to build all necessary images.

-   **On Linux:**
    ```bash
    chmod +x build.sh
    ./build.sh
    ```
-   **On Windows (Command Prompt or PowerShell):**
    ```cmd
    .\build.bat
    ```

*Note: The Windows `build.bat` is a placeholder. You will need to create this file or follow the manual build steps.*

### Step 3: Start the Application

Once the images are built, start the services using Docker Compose:

```bash
docker compose up
```

Add the `-d` flag to run the containers in the background (detached mode).

---

## Usage

1.  **Access the Web Panel:** Open your web browser and navigate to **[http://localhost:3000](http://localhost:3000)**.
2.  **Create a VPS:** Click the "+ Create New VPS" button.
3.  **Manage a VPS:** Use the Start, Stop, Restart, and Delete buttons for each instance.
4.  **Connect via SSH:** The dashboard provides the exact SSH command to connect to your running VPS. The credentials are:
    -   **Username:** `vpsuser`
    -   **Password:** `password`

    *Example command (the port will be different for you):*
    ```bash
    ssh vpsuser@localhost -p 32768
    ```

## Troubleshooting

-   **500 Errors on Linux:** If you get a "500 Internal Server Error", it almost always means the backend container cannot communicate with the Docker socket. Double-check that you have completed **Step 1** correctly and have the right GID in your `docker-compose.yml` file.
-   **`buildx` error:** If you try `docker compose up --build` and get an error about `buildx`, your Docker installation is missing the Buildx component. The provided `./build.sh` script is the recommended way to build the images.
