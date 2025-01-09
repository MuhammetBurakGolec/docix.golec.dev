import React, { useState, useEffect, useRef } from 'react';
import './DashBoard.css';
import { fetchContainers, startContainer, stopContainer, deleteContainer } from '../../services/api';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Dashboard = () => {
  const [containers, setContainers] = useState([]);
  const [healthStatus, setHealthStatus] = useState({ healthy: 0, unhealthy: 0, total: 0 });
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [terminalContainer, setTerminalContainer] = useState(null);

  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const fitAddon = useRef(new FitAddon());
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchContainers();
        setContainers(data.containers || []);
        updateHealthStatus(data.containers);
      } catch (error) {
        console.error('Dashboard veri yükleme hatası:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalContainer && terminalRef.current) {
        // Terminal configuration
        terminalInstance.current = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'monospace',
        });

        terminalInstance.current.loadAddon(fitAddon.current);
        terminalInstance.current.open(terminalRef.current);
        fitAddon.current.fit();

        // WebSocket connection with container ID
        const wsUrl = `ws://localhost:8084/ws?containerId=${terminalContainer.Id}`;
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            terminalInstance.current.write('\r\nBağlantı kuruldu\r\n');
        };

        socketRef.current.onmessage = (event) => {
            terminalInstance.current.write(event.data);
        };

        socketRef.current.onclose = () => {
            terminalInstance.current.write('\r\nBağlantı kapandı\r\n');
        };

        // Handle terminal input
        terminalInstance.current.onData(data => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(data);
            }
        });

        // Handle window resize
        const handleResize = () => {
            fitAddon.current.fit();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (terminalInstance.current) {
                terminalInstance.current.dispose();
            }
        };
    }
}, [terminalContainer]);

  const updateHealthStatus = (containers) => {
    const status = containers.reduce(
      (acc, container) => {
        if (container.State === 'running') acc.healthy++;
        else acc.unhealthy++;
        return acc;
      },
      { healthy: 0, unhealthy: 0 }
    );

    status.total = containers.length;
    setHealthStatus(status);
  };

  const handleStart = async (id) => {
    try {
      await startContainer(id);
      const updatedContainers = await fetchContainers();
      setContainers(updatedContainers.containers || []);
      updateHealthStatus(updatedContainers.containers);
    } catch (error) {
      console.error('Container başlatma hatası:', error);
    }
  };

  const handleStop = async (id) => {
    try {
      await stopContainer(id);
      const updatedContainers = await fetchContainers();
      setContainers(updatedContainers.containers || []);
      updateHealthStatus(updatedContainers.containers);
    } catch (error) {
      console.error('Container durdurma hatası:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContainer(id);
      const updatedContainers = await fetchContainers();
      setContainers(updatedContainers.containers || []);
      updateHealthStatus(updatedContainers.containers);
    } catch (error) {
      console.error('Container silme hatası:', error);
    }
  };

  const handleDetails = (container) => {
    setSelectedContainer(container);
  };

  const closeModal = () => {
    setSelectedContainer(null);
  };

  const handleTerminal = (container) => {
    setTerminalContainer(container);
  };

  const closeTerminal = () => {
    setTerminalContainer(null);
    if (socketRef.current) {
      socketRef.current.close();
    }
    if (terminalInstance.current) {
      terminalInstance.current.dispose();
    }
  };

  return (
    <div className="dashboard">
      <h1>Container Yönetimi</h1>
      <div className="health-status">
        <p>Sağlıklı: {healthStatus.healthy}</p>
        <p>Sağlıksız: {healthStatus.unhealthy}</p>
        <p>Toplam: {healthStatus.total}</p>
      </div>
      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container) => (
            <tr key={container.Id}>
              <td>{container.Id}</td>
              <td>{container.Names[0]}</td>
              <td>{container.State}</td>
              <td>
                <button className="details" onClick={() => handleDetails(container)}>
                  <i className="fas fa-info-circle"></i>
                </button>
                {container.State !== 'running' && (
                  <button className="start" onClick={() => handleStart(container.Id)}>
                    <i className="fas fa-play"></i>
                  </button>
                )}
                {container.State === 'running' && (
                  <button className="stop" onClick={() => handleStop(container.Id)}>
                    <i className="fas fa-stop"></i>
                  </button>
                )}
                <button className="delete" onClick={() => handleDelete(container.Id)}>
                  <i className="fas fa-trash"></i>
                </button>
                <button className="terminal" onClick={() => handleTerminal(container)}>
                  <i className="fas fa-terminal"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedContainer && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Container Detayları</h2>
            <p>
              <strong>ID:</strong> {selectedContainer.Id}
            </p>
            <p>
              <strong>İsim:</strong> {selectedContainer.Names[0]}
            </p>
            <p>
              <strong>Durum:</strong> {selectedContainer.State}
            </p>
            <p>
              <strong>Image:</strong> {selectedContainer.Image}
            </p>
            <p>
              <strong>Command:</strong> {selectedContainer.Command}
            </p>
            <p>
              <strong>Created:</strong> {new Date(selectedContainer.Created * 1000).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedContainer.Status}
            </p>
            <p>
              <strong>Ports:</strong>{' '}
              {selectedContainer.Ports.map(
                (port) => `${port.PrivatePort}->${port.PublicPort}/${port.Type}`
              ).join(', ')}
            </p>
          </div>
        </div>
      )}

      {terminalContainer && (
        <div className="modal terminal-modal">
          <div className="modal-content terminal-modal-content">
            <span className="close" onClick={closeTerminal}>
              &times;
            </span>
            <h2>Web Terminal - {terminalContainer.Names[0]}</h2>
            <div className="terminal" ref={terminalRef}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;