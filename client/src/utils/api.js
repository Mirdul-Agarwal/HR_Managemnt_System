// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend base URL
});

// Add token to requests if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);

export const addCandidate = (candidateData) =>
    API.post('/candidates', candidateData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
export const getCandidates = () => API.get('/candidates');


export const submitLeave = (leaveFormData) =>
    API.post("/leaves", leaveFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  

    export const addLeave = (leaveData) =>
        API.post('/leaves', leaveData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      
      export const getLeaves = () => API.get('/leaves');

      export const updateLeaveStatus = (id, data) =>
        axios.put(`http://localhost:5000/api/leaves/${id}/status`, data);
      