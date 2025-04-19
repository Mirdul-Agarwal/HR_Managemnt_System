const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  downloadResume
} = require('../controllers/employeeUser');

const { protect } = require('../middlewares/authenticate');
const upload = require('../middlewares/fileUpload');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(upload.single('resume'), createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(upload.single('resume'), updateEmployee)
  .delete(deleteEmployee);

router.get('/:id/resume', downloadResume);

module.exports = router;