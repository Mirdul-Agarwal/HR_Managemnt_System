const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide employee name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  position: {
    type: String,
    required: [true, 'Please specify the position']
  },
  department: {
    type: String,
    required: [true, 'Please specify the department']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Please provide joining date']
  },
  role: {
    type: String,
    required: [true, 'Please specify the role']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Selected'
  },
  resume: {
    type: String, // Path to the uploaded file
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);