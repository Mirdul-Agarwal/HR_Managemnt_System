

import React, { useState } from "react";
import { addLeave } from "../utils/api"; // adjust path
import "../styles/LeaveModal.css"; // your custom CSS

const AddLeaveModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    reason: "",
    docs: null
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "docs" ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("date", formData.date);
    data.append("reason", formData.reason);
    if (formData.docs) {
      data.append("document", formData.docs);
    }

    try {
      await addLeave(data);
      onClose();
    } catch (err) {
      console.error("Leave submit error:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Leave</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" onChange={handleChange} required />

          <label>Date</label>
          <input type="date" name="date" onChange={handleChange} required />

          <label>Reason</label>
          <textarea name="reason" onChange={handleChange} required />

          <label>Upload Docs (Optional)</label>
          <input type="file" name="docs" onChange={handleChange} />

          <div className="modal-buttons">
            <button type="submit" className="save-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeaveModal;

