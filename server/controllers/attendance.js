const Attendance = require('../models/attendanceModel');
const Employee = require('../models/employeeModel');
const moment = require('moment');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    // Extract filter parameters
    const { date, employee, status, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Only show attendance for active employees
    const activeEmployees = await Employee.find({ status: 'Active' }).select('_id');
    const activeEmployeeIds = activeEmployees.map(emp => emp._id);
    filter.employee = { $in: activeEmployeeIds };
    
    if (date) {
      // Parse date in format YYYY-MM-DD
      const startDate = moment(date).startOf('day').toDate();
      const endDate = moment(date).endOf('day').toDate();
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    if (employee) {
      filter.employee = employee;
    }
    
    if (status) {
      filter.status = status;
    }
    
    // Find attendance records with populated employee details
    const attendance = await Attendance.find(filter)
      .populate('employee', 'name position department')
      .sort({ date: -1 });
    
    // If search parameter is provided, filter results by employee name
    let filteredAttendance = attendance;
    if (search) {
      filteredAttendance = attendance.filter(record => 
        record.employee.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: filteredAttendance.length,
      data: filteredAttendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance records',
      error: err.message
    });
  }
};

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private
exports.getAttendanceRecord = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('employee', 'name position department');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance record',
      error: err.message
    });
  }
};

// @desc    Create new attendance record
// @route   POST /api/attendance
// @access  Private
exports.createAttendance = async (req, res) => {
  try {
    const { employee, date, status, checkInTime, checkOutTime, notes } = req.body;

    // Check if employee exists and is active
    const employeeExists = await Employee.findOne({ 
      _id: employee,
      status: 'Active'
    });

    if (!employeeExists) {
      return res.status(400).json({
        success: false,
        message: 'Employee not found or not active'
      });
    }

    // Check if attendance record already exists for this employee on this date
    const existingRecord = await Attendance.findOne({
      employee,
      date: {
        $gte: moment(date).startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate()
      }
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'Attendance record already exists for this employee on this date'
      });
    }

    const attendance = await Attendance.create({
      employee,
      date,
      status,
      checkInTime,
      checkOutTime,
      notes
    });

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating attendance record',
      error: err.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
exports.updateAttendance = async (req, res) => {
  try {
    let attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Update attendance data
    attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('employee', 'name position department');

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance record',
      error: err.message
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance record',
      error: err.message
    });
  }
};

// @desc    Get attendance records by date range
// @route   GET /api/attendance/range
// @access  Private
exports.getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both start and end dates'
      });
    }
    
    // Parse dates
    const start = moment(startDate).startOf('day').toDate();
    const end = moment(endDate).endOf('day').toDate();
    
    // Only show attendance for active employees
    const activeEmployees = await Employee.find({ status: 'Active' }).select('_id');
    const activeEmployeeIds = activeEmployees.map(emp => emp._id);
    
    const attendance = await Attendance.find({
      employee: { $in: activeEmployeeIds },
      date: { $gte: start, $lte: end }
    }).populate('employee', 'name position department')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance records',
      error: err.message
    });
  }
};