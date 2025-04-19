


import React, { useEffect, useState } from 'react';
import '../styles/Candidates.css';
import AddCandidateModal from '../components/AddCandidateModal';
import { getCandidates } from '../utils/api';

const Candidates = () => {
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const handleModalToggle = () => setShowModal(!showModal);

  const fetchCandidates = async () => {
    try {
      const res = await getCandidates();
      setCandidates(res.data.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div className="candidates-page">
      <div className="candidates-header">
        <div className="filters">
          <select><option>Status</option></select>
          <select><option>Position</option></select>
        </div>
        <div className="search-add">
          <input type="text" placeholder="🔍 Search" />
          <button className="add-btn" onClick={handleModalToggle}>Add Candidate</button>
        </div>
      </div>

      <table className="candidates-table">
        <thead>
          <tr>
            <th>Sr no.</th>
            <th>Candidate Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={candidate._id}>
              <td>{index + 1}</td>
              <td>{candidate.name}</td>
              <td>{candidate.email}</td>
              <td>{candidate.phone}</td>
              <td>{candidate.position}</td>
              <td>{candidate.status}</td>
              <td>{candidate.experience}</td>
              <td>
                {/* Placeholder for future action buttons */}
                <button>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && <AddCandidateModal onClose={() => {
        handleModalToggle();
        fetchCandidates(); // Refresh after adding
      }} />}
    </div>
  );
};

export default Candidates;

