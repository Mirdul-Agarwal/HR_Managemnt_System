



const Leave = require('../models/leaveModel');
const path = require('path');
const fs = require('fs');

// POST Leave
exports.createLeave = async (req, res) => {
  try {
    const { name, date, reason } = req.body;

    const leaveData = {
      name,
      date,
      reason
    };

    if (req.file) {
      leaveData.document = req.file.path;
    }

    const leave = await Leave.create(leaveData);

    res.status(201).json({
      success: true,
      data: leave
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating leave',
      error: err.message
    });
  }
};


exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaves',
      error: err.message
    });
  }
};
