import React, { useEffect, useState } from "react";
import "../styles/Leaves.css";
import AddLeaveModal from "../components/LeaveModal";
import { submitLeave, getLeaves } from "../utils/api";

const Leaves = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await getLeaves();
      const initializedLeaves = res.data.data.map((leave) => ({
        ...leave,
        status: leave.status || "Pending",
      }));
      setLeaves(initializedLeaves);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAddLeave = async (leaveData) => {
    try {
      const formData = new FormData();
      Object.entries(leaveData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await submitLeave(formData);
      console.log("Leave submitted:", res.data);
      fetchLeaves();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error submitting leave:", err);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedLeaves = leaves.map((leave) =>
      leave._id === id ? { ...leave, status: newStatus } : leave
    );
    setLeaves(updatedLeaves);
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="leaves-container">
      <div className="leaves-header">
        <h2>Leaves</h2>
        <select>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="leaves-content">
        <div className="leaves-table">
          <h3>Applied Leaves</h3>
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No leaves found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      <img
                        src="/default-avatar.png"
                        alt="profile"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                        }}
                      />
                    </td>
                    <td>{leave.name}</td>
                    <td>{new Date(leave.date).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <select
                        value={leave.status}
                        onChange={(e) =>
                          handleStatusChange(leave._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="leave-calendar">
          <div className="calendar-header">
            <h3>Leave Calendar - {currentDate.toLocaleString("default", { month: "long" })} {year}</h3>
            <button onClick={() => setIsModalOpen(true)}>Add Leave</button>
          </div>

          <div className="calendar-box">
            <div className="calendar-grid">
              {Array.from({ length: daysInMonth }, (_, index) => {
                const date = new Date(year, month, index + 1);
                const formatted = date.toISOString().split("T")[0];

                const leavesOnDay = leaves.filter(
                  (leave) =>
                    leave.status === "Approved" &&
                    new Date(leave.date).toISOString().split("T")[0] === formatted
                );

                return (
                  <div
                    key={formatted}
                    className={`calendar-day ${leavesOnDay.length > 0 ? "highlight-day" : ""}`}
                  >
                    <div className="day-number">{index + 1}</div>
                    {leavesOnDay.length > 0 && (
                      <ul className="leave-names">
                        {leavesOnDay.map((leave) => (
                          <li key={leave._id}>{leave.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AddLeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLeave}
      />
    </div>
  );
};

export default Leaves;
