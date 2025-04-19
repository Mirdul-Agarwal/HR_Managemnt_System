const express = require('express');
const {
  getAttendance,
  getAttendanceRecord,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceByDateRange
} = require('../controllers/attendance');

const { protect } = require('../middlewares/authenticate');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getAttendance)
  .post(createAttendance);

router.get('/range', getAttendanceByDateRange);

router.route('/:id')
  .get(getAttendanceRecord)
  .put(updateAttendance)
  .delete(deleteAttendance);

module.exports = router;