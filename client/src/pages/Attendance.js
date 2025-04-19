
import React, { useEffect, useState } from "react";
import "../styles/Attendance.css";
import { getCandidates } from "../utils/api";
const MoreVertical = () => <span style={{ fontSize: "18px" }}>⋮</span>;
 // You can also use Unicode if not using lucide

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const res = await getCandidates();
        const selected = res.data.data.filter((c) => c.status === "Selected");

        const initialAttendance = {};
        selected.forEach((emp) => {
          initialAttendance[emp._id] = "Present";
        });

        setEmployees(selected);
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Error fetching selected candidates:", error);
      }
    };

    fetchSelectedCandidates();
  }, []);

  const handleStatusChange = (id, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>Attendance</h2>
        <select>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="attendance-table">
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>
                  <img
                    src="/default-profile.png"
                    alt="Profile"
                    style={{ width: "40px", borderRadius: "50%" }}
                  />
                </td>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.task}</td>
                <td>
                  <select
                    value={attendance[emp._id]}
                    onChange={(e) => handleStatusChange(emp._id, e.target.value)}
                    className={`status-dropdown ${attendance[emp._id] === "Present" ? "green" : "red"}`}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
                <td>
                  <button className="action-btn">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
