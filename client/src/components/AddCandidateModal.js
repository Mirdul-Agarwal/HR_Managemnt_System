

import React, { useState } from 'react';
import { addCandidate } from '../utils/api';
import '../styles/AddCandidateModal.css';

const AddCandidateModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    department: 'Designer', // default, not shown
    task: 'HRMS',           // default, not shown
    resume: null,
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('position', formData.position);
      data.append('experience', formData.experience);
      data.append('department', formData.department); // send default
      data.append('task', formData.task);             // send default
      data.append('resume', formData.resume);

      await addCandidate(data);
      alert('Candidate added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Failed to add candidate!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Candidate</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name*" required />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address*" required />
          </div>
          <div className="form-row">
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number*" required />
            <input name="position" value={formData.position} onChange={handleChange} placeholder="Position*" required />
          </div>
          <div className="form-row">
            <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience*" required />
            <div className="upload-wrapper">
              <input type="file" name="resume" onChange={handleChange} required />
            </div>
          </div>

          <div className="declaration">
            <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} />
            <span>I hereby declare that the above information is true to the best of my knowledge and belief</span>
          </div>

          <button type="submit" className="save-btn" disabled={!formData.agreed}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;

