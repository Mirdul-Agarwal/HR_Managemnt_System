const Employee = require('../models/employeeModel');
const fs = require('fs');
const path = require('path');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    // Extract filter parameters
    const { status, department, role, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (department) {
      filter.department = department;
    }
    
    if (role) {
      filter.role = role;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employees',
      error: err.message
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employee',
      error: err.message
    });
  }
};

exports.createEmployee = async (req, res) => {
    try {
      const { name, email, phone, position, department, joiningDate, role, status } = req.body;
  
      // Create employee with file path if uploaded
      const employeeData = {
        name,
        email, 
        phone,
        position,
        department,
        joiningDate,
        role,
        status: status || 'Active'
      };
  
      // If file was uploaded, add the path
      if (req.file) {
        employeeData.resume = req.file.path;
      }
  
      const employee = await Employee.create(employeeData);
  
      res.status(201).json({
        success: true,
        data: employee
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error creating employee',
        error: err.message
      });
    }
  };
  
  // @desc    Update employee
  // @route   PUT /api/employees/:id
  // @access  Private
  exports.updateEmployee = async (req, res) => {
    try {
      let employee = await Employee.findById(req.params.id);
  
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }
  
      // Update employee data
      const updateData = { ...req.body };
      
      // If file was uploaded, update the path
      if (req.file) {
        // Delete previous resume if exists
        if (employee.resume) {
          const filePath = path.join(__dirname, '..', employee.resume);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        updateData.resume = req.file.path;
      }
  
      employee = await Employee.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );
  
      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error updating employee',
        error: err.message
      });
    }
  };
  
  // @desc    Delete employee
  // @route   DELETE /api/employees/:id
  // @access  Private
  exports.deleteEmployee = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
  
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }
  
      // Delete resume file if exists
      if (employee.resume) {
        const filePath = path.join(__dirname, '..', employee.resume);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
  
      await employee.remove();
  
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error deleting employee',
        error: err.message
      });
    }
  };

  // @desc    Download employee resume
// @route   GET /api/employees/:id/resume
// @access  Private
exports.downloadResume = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
  
      if (!employee || !employee.resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
  
      const filePath = path.join(__dirname, '..', employee.resume);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'Resume file not found'
        });
      }
  
      res.download(filePath);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error downloading resume',
        error: err.message
      });
    }
  };