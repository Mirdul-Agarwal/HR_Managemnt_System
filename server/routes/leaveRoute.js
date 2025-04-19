
const express = require('express');
const router = express.Router();
const { createLeave, getLeaves } = require('../controllers/leave');
const upload = require('../middlewares/fileUpload'); // multer middleware

router
  .route('/')
  .get(getLeaves)
  .post(upload.single('document'), createLeave);

module.exports = router;
