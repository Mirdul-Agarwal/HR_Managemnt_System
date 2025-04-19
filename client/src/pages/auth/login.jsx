

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/api';
import './auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/dashboard/candidates'); // redirect to dashboard
    } catch (error) {
      console.error(error);
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left"><h1>LOGO</h1></div>
      <div className="auth-right">
        <div className="auth-box">
          <h2>Welcome Back</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Email Address*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Password*</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <button type="submit" className="auth-btn">Login</button>

            <div className="auth-footer">
              Don't have an account? <a href="/register">Register</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

