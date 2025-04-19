



import React, { useEffect, useState } from "react";
import "../styles/Employee.css";
import { getCandidates } from "../utils/api";
import EditEmployeeModal from "../components/EditEmployeeModal";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const res = await getCandidates();
        const selected = res.data.data.filter(c => c.status === "Selected");
        setEmployees(selected);
      } catch (error) {
        console.error("Error fetching selected candidates:", error);
      }
    };

    fetchSelectedCandidates();
  }, []);

  const handleViewClick = (employee) => {
    setSelectedEmployee({
      ...employee,
      fullName: employee.name,
      dateOfJoining: new Date(employee.createdAt).toISOString().split("T")[0], // Convert to yyyy-mm-dd
    });
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedData) => {
    // You can send updatedData to your backend here if needed
    console.log("Updated data to send to backend:", updatedData);

    // Update local state (optional)
    setEmployees((prev) =>
      prev.map((emp) =>
        emp._id === updatedData._id ? { ...emp, ...updatedData } : emp
      )
    );
  };

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h2>Employees</h2>
        <select>
          <option value="position">Position</option>
        </select>
      </div>

      <div className="employees-table">
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
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
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleViewClick(emp)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeData={selectedEmployee}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Employees;
