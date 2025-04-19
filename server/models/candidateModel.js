const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide candidate name'],
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
  experience: {
    type: String,
    required: [true, 'Please provide experience details']
  },
  status: {
    type: String,
    default: 'Selected'
  },
  department: {
    type: String,
    // enum: ['Engineer', 'Interviewed', 'Selected', 'Rejected'],
    required: [true, 'Write Department']
  },
  task: {
    type: String,
    // enum: ['Applied', 'Interviewed', 'Selected', 'Rejected'],
    required: [true, 'Task']
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

module.exports = mongoose.model('Candidate', CandidateSchema);