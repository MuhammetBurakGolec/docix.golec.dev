import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">DevOps Yönetim Platformu</h1>
        <p className="hero-subtitle">
          Docker konteynerlerinizi yönetin, sunucularınızı izleyin ve CI/CD süreçlerinizi tek bir platformdan kontrol edin
        </p>
        
        <div className="cta-buttons">
          <Link to="/dashboard" className="primary-button">
            Yönetim Paneline Git
          </Link>
          <Link to="/documentation" className="secondary-button">
            Dokümantasyon
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2 className="features-title">Temel Özellikler</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🐳</div>
            <h3>Docker Yönetimi</h3>
            <p>Konteynerlerinizi kolayca oluşturun, yönetin ve izleyin</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Sunucu Monitoring</h3>
            <p>Gerçek zamanlı metrikler ve detaylı performans analizleri</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>CI/CD Pipeline</h3>
            <p>Otomatik dağıtım süreçleri ve versiyon kontrolü</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Hızlı Deployment</h3>
            <p>Tek tıkla deployment ve rollback imkanı</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;