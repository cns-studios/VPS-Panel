# VPS Management Panel

This project provides a simple web-based panel to manage virtual private servers (VPS) running in Docker containers.

## Features

- **Web-based Dashboard:** View and manage all your VPS instances from a clean web interface.
- **Lifecycle Management:** Start, stop, and restart VPS containers directly from the dashboard.
- **One-Click Creation:** Create new, SSH-enabled VPS instances with a single click.
- **Secure SSH Access:** Each VPS gets a unique, automatically assigned port for secure SSH connections.
- **Easy Setup:** Uses Docker Compose for a streamlined setup process.

---

## Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

- **Docker:** You must have Docker installed and running. [Installation Guide](https://docs.docker.com/engine/install/)
- **Docker Compose:** You need Docker Compose. It is included with Docker Desktop, but may need to be installed separately on Linux. [Installation Guide](https://docs.docker.com/compose/install/)

### Step 1: Configure Docker Permissions

This is the most critical step. The backend service needs permission to communicate with the Docker engine on your computer.

1.  Find the Group ID (GID) of the `docker` group on your system by running this command:

    ```bash
    getent group docker
    ```

2.  You will see output like `docker:x:969:your_username`. The number (e.g., `969`) is your Docker GID.

3.  Open the `docker-compose.yml` file in this directory. Find the `group_add` section under the `backend` service and replace the default value with **your** GID.

    ```yaml
    services:
      backend:
        # ... other settings
        group_add:
          - "969" # <-- IMPORTANT: Replace 969 with your Docker GID
    ```

### Step 2: Build the Docker Images

I have created a simple script to build all the necessary Docker images for you. This avoids potential issues with the `docker compose build` command on some systems.

Run the following command in the project root directory:

```bash
./build.sh
```

This will build the `vps-ssh-image`, the `vps-management-backend`, and the `vps-management-frontend` images.

### Step 3: Start the Application

Once the images are built, you can start all the services using Docker Compose.

```bash
docker compose -f docker-compose.yml up
```

The `-d` flag can be added to run the containers in the background (detached mode).

### Step 4: Access the Web Panel

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

## Troubleshooting

-   **500 Errors:** If you get a "500 Internal Server Error", it almost always means the backend container cannot communicate with the Docker socket. Double-check that you have completed **Step 1** correctly and have the right GID in your `docker-compose.yml` file.
-   **`buildx` error:** If you try to run `docker compose up --build` and get an error about `buildx`, it means your Docker installation is missing the Buildx component. The recommended solution is to use the `./build.sh` script provided.
