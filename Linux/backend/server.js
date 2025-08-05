const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');

const app = express();
const port = 3001;
// This will connect to the Docker daemon socket
const docker = new Docker();

app.use(cors());
app.use(express.json());

const VPS_IMAGE_NAME = 'vps-ssh-image';

// Centralized error handler
const handleAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error("API Error:", err);
        // Avoid sending detailed internal errors to the client
        res.status(500).json({ error: 'An unexpected server error occurred.' });
    });
};

// Get all containers that were created from our VPS image
app.get('/api/vps', handleAsync(async (req, res) => {
    const containers = await docker.listContainers({ 
        all: true,
        filters: { ancestor: [VPS_IMAGE_NAME] }
    });
    // We need more details than listContainers provides, so we inspect each one
    const detailedContainers = await Promise.all(
        containers.map(containerInfo => docker.getContainer(containerInfo.Id).inspect())
    );
    res.json(detailedContainers);
}));

// Create a new VPS
app.post('/api/vps', handleAsync(async (req, res) => {
    console.log('Received request to create a new VPS...');
    const container = await docker.createContainer({
        Image: VPS_IMAGE_NAME,
        // Use a more friendly naming scheme
        name: `vps-${Math.random().toString(36).substring(2, 8)}`,
        ExposedPorts: { '22/tcp': {} },
        HostConfig: {
            // Let Docker assign a random available port on the host
            PortBindings: { '22/tcp': [{ HostPort: '' }] },
            // Ensure the container restarts automatically
            RestartPolicy: { Name: 'unless-stopped' }
        }
    });

    await container.start();
    console.log(`Container ${container.id} started successfully.`);
    const containerDetails = await container.inspect();
    res.status(201).json(containerDetails);
}));

// Perform an action on a VPS (start, stop, restart)
app.post('/api/vps/:id/:action', handleAsync(async (req, res) => {
    const { id, action } = req.params;
    console.log(`Action '${action}' requested for container ${id}`);
    const container = docker.getContainer(id);

    switch (action) {
        case 'start':
            await container.start();
            res.json({ message: 'VPS started successfully' });
            break;
        case 'stop':
            await container.stop();
            res.json({ message: 'VPS stopped successfully' });
            break;
        case 'restart':
            await container.restart();
            res.json({ message: 'VPS restarted successfully' });
            break;
        default:
            res.status(400).json({ error: 'Invalid action specified' });
            return;
    }
    console.log(`Action '${action}' completed for container ${id}`);
}));

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});