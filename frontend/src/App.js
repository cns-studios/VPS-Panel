import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [vpsList, setVpsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVpsList = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/vps`);
      const sortedList = response.data.sort((a, b) => new Date(b.Created) - new Date(a.Created));
      setVpsList(sortedList);
    } catch (err) {
      console.error('Error fetching VPS list:', err);
      setError('Failed to fetch VPS list. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVpsList();
  }, [fetchVpsList]);

  const handleCreateVps = async () => {
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/vps`);
      setTimeout(fetchVpsList, 1000); // Refresh list after creation
    } catch (err) {
      console.error('Error creating VPS:', err);
      setError('Failed to create VPS. Check backend logs for details.');
      setIsLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/vps/${id}/${action}`);
      setTimeout(fetchVpsList, 1000); // Refresh list after action
    } catch (err) {
      console.error(`Error performing action ${action} on VPS ${id}:`, err);
      setError(`Failed to ${action} VPS. Check backend logs for details.`);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this VPS?')) {
      setIsLoading(true);
      setError('');
      try {
        await axios.delete(`${API_BASE_URL}/vps/${id}`);
        setTimeout(fetchVpsList, 1000); // Refresh list after deletion
      } catch (err) {
        console.error(`Error deleting VPS ${id}:`, err);
        setError('Failed to delete VPS. Check backend logs for details.');
        setIsLoading(false);
      }
    }
  };

  const getSshPort = (vps) => {
    try {
      // Correctly access the port from the container inspect data
      return vps.NetworkSettings.Ports['22/tcp'][0].HostPort;
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="container mt-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>VPS Management Panel</h1>
        <button className="btn btn-primary" onClick={handleCreateVps} disabled={isLoading}>
          {isLoading ? 'Processing...' : '+ Create New VPS'}
        </button>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>SSH Connection</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vpsList.length > 0 ? vpsList.map(vps => {
              const sshPort = getSshPort(vps);
              const sshCommand = `ssh vpsuser@localhost -p ${sshPort}`;
              // Use vps.Name and vps.State.Status, which are the correct properties
              const status = vps.State.Status;
              const isRunning = status === 'running';

              return (
                <tr key={vps.Id}>
                  <td><strong>{vps.Name.substring(1)}</strong></td>
                  <td>
                    <span className={`badge ${isRunning ? 'bg-success' : 'bg-secondary'}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    {isRunning && sshPort !== 'N/A' ? (
                      <div className="input-group input-group-sm">
                        <input type="text" className="form-control" value={sshCommand} readOnly />
                        <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(sshCommand)}>Copy</button>
                      </div>
                    ) : (
                      'Not Available'
                    )}
                  </td>
                  <td className="text-center">
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(vps.Id, 'start')} disabled={isLoading || isRunning}>Start</button>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleAction(vps.Id, 'stop')} disabled={isLoading || !isRunning}>Stop</button>
                    <button className="btn btn-info btn-sm me-2" onClick={() => handleAction(vps.Id, 'restart')} disabled={isLoading || !isRunning}>Restart</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(vps.Id)} disabled={isLoading}>Delete</button>
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan="4" className="text-center py-5">
                  {isLoading ? 'Loading VPS list...' : 'No VPS instances found. Create one to get started!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
