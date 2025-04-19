const Candidate = require('../models/candidateModel');
const Employee = require('../models/employeeModel');
const fs = require('fs');
const path = require('path');

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
exports.getCandidates = async (req, res) => {
  try {
    // Extract filter parameters
    const { status, position, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (position) {
      filter.position = position;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving candidates',
      error: err.message
    });
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private
exports.getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving candidate',
      error: err.message
    });
  }
};

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Private
exports.createCandidate = async (req, res) => {
  try {
    const { name, email, phone, position, experience, status,department,task } = req.body;

    // Create candidate with file path if uploaded
    const candidateData = {
      name,
      email,
      phone,
      position,
      experience,
      status: status || 'Selected',
      department,
      task
    };

    // If file was uploaded, add the path
    if (req.file) {
      candidateData.resume = req.file.path;
    }

    const candidate = await Candidate.create(candidateData);

    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating candidate',
      error: err.message
    });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private
exports.updateCandidate = async (req, res) => {
  try {
    let candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Update candidate data
    const updateData = { ...req.body };
    
    // If file was uploaded, update the path
    if (req.file) {
      // Delete previous resume if exists
      if (candidate.resume) {
        const filePath = path.join(__dirname, '..', candidate.resume);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      updateData.resume = req.file.path;
    }

    candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating candidate',
      error: err.message
    });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Delete resume file if exists
    if (candidate.resume) {
      const filePath = path.join(__dirname, '..', candidate.resume);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await candidate.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting candidate',
      error: err.message
    });
  }
};

// @desc    Convert candidate to employee
// @route   POST /api/candidates/:id/convert
// @access  Private
exports.convertToEmployee = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Extract additional employee data from request
    const { department, joiningDate, role } = req.body;

    // Create employee from candidate data
    const employee = await Employee.create({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      department,
      joiningDate,
      role,
      status: 'Active',
      resume: candidate.resume
    });

    // Update candidate status to Selected
    candidate.status = 'Selected';
    await candidate.save();

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error converting candidate to employee',
      error: err.message
    });
  }
};

// @desc    Download candidate resume
// @route   GET /api/candidates/:id/resume
// @access  Private
exports.downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate || !candidate.resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    const filePath = path.join(__dirname, '..', candidate.resume);
    
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