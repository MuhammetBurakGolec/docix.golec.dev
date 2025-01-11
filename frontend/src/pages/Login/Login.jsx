import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      onLogin(true);
      navigate('/');
    }
  }, [navigate, onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error('Email ve şifre zorunludur');
        return;
      }

      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail) {
        toast.error('Geçerli bir email adresi giriniz');
        return;
      }

      // Mock credentials check
      if (email === 'admin@admin.com' && password === 'admin') {
        const mockToken = 'mock-jwt-token';
        localStorage.setItem('token', mockToken);
        onLogin(true);
        toast.success('Giriş başarılı');
        navigate('/');
      } else {
        toast.error('Geçersiz kullanıcı bilgileri');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Giriş başarısız. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;