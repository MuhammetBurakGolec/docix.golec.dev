import React, { useState, useEffect } from "react";
import { fetchContainers } from "../../services/api";
import "./DockerStatus.css";
import RiseLoader from "react-spinners/RiseLoader";

const DockerStatus = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getContainers = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 400));
        const response = await fetchContainers();
        const containerArray = response?.containers || [];
        setContainers(containerArray);
        setError(null);
      } catch (err) {
        setError("Docker konteynerları yüklenirken bir hata oluştu.");
        console.error("Docker API Hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    getContainers();
    const interval = setInterval(getContainers, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (status) => {
    return status.replace("Up ", "");
  };

  const formatCreatedTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('tr-TR');
  };

  const formatPorts = (ports) => {
    if (!ports || ports.length === 0) return "Yok";
    return ports
      .filter(p => p.PublicPort)
      .map(p => `${p.PublicPort}:${p.PrivatePort}`).join(", ");
  };

  const getNetworkInfo = (networkSettings) => {
    if (!networkSettings.Networks) return "Yok";
    const network = Object.values(networkSettings.Networks)[0];
    return network.IPAddress || "Yok";
  };

  const getContainerStateClass = (state) => {
    state = state.toLowerCase();
    switch (state) {
      case 'running':
        return 'running';
      case 'exited':
      case 'stopped':
        return 'stopped';
      case 'restarting':
        return 'restarting';
      default:
        return 'unknown';
    }
  };

  const getFilteredContainers = () => {
    if (statusFilter === 'all') return containers;
    return containers.filter(container => 
      container.State.toLowerCase() === statusFilter.toLowerCase()
    );
  };

  if (loading) {
    return (
      <div className="docker-status-loading">
        <RiseLoader 
        color="#0593b3"/>
      </div>
    );
  }

  if (error) {
    return <div className="docker-status-error">{error}</div>;
  }

  return (
    <div className="docker-status-container">
      <h1 className="docker-status-title">Docker Konteyner Durumu</h1>
      
      <div className="controls">
        <div className="filter-options">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="running">Çalışıyor</option>
            <option value="exited">Durmuş</option>
            <option value="restarting">Yeniden Başlatılıyor</option>
          </select>
        </div>

        <div className="view-options">
          <button
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Liste Görünümü"
          >
            <svg className="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button 
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid Görünümü"
          >
            <svg className="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'containers-grid' : 'containers-list'}>
        {getFilteredContainers().map((container) => (
          <div key={container.Id} className={`container-card ${getContainerStateClass(container.State)}`}>
            <div className="container-header">
              <h2>{container.Names[0].replace("/", "")}</h2>
              <span className={`status-badge ${getContainerStateClass(container.State)}`}>
                {container.State}
              </span>
            </div>
            <div className="container-details">
              <p><strong>ID:</strong> {container.Id.slice(0, 12)}</p>
              <p><strong>Image:</strong> {container.Image}</p>
              <p><strong>Ports:</strong> {formatPorts(container.Ports)}</p>
              <p><strong>Oluşturulma:</strong> {formatCreatedTime(container.Created)}</p>
              <p><strong>Çalışma Süresi:</strong> {formatUptime(container.Status)}</p>
              <p><strong>IP Adresi:</strong> {getNetworkInfo(container.NetworkSettings)}</p>
              <p><strong>Network:</strong> {container.HostConfig.NetworkMode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DockerStatus;