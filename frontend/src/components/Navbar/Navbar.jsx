import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span>Dockix</span>
        </Link>
        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              <Link to="/docker-status" className="nav-link">Docker Durumu</Link>
              <Link to="/profile" className="nav-link">Profil</Link>
              <button 
                onClick={() => setIsLoggedIn(false)} 
                className="nav-link"
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Giriş Yap</Link>
              <Link to="/register" className="nav-link">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;