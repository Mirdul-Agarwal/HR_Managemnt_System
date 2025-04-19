



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../utils/api';
import './auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'hr', // default role
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Registered successfully!");
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert("Registration failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left"><h1>LOGO</h1></div>
      <div className="auth-right">
        <div className="auth-box">
          <h2>Welcome to Dashboard</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Full name*</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Email Address*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Password*</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>Role*</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>

            <button type="submit" className="auth-btn">Register</button>

            <div className="auth-footer">
              Already have an account? <a href="/login">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
