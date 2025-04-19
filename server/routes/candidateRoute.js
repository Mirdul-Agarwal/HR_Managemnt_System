const express = require('express');
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  convertToEmployee,
  downloadResume
} = require('../controllers/candidateUser');

const { protect } = require('../middlewares/authenticate');
const upload = require('../middlewares/fileUpload');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getCandidates)
  .post(upload.single('resume'), createCandidate);

router.route('/:id')
  .get(getCandidate)
  .put(upload.single('resume'), updateCandidate)
  .delete(deleteCandidate);

router.post('/:id/convert', convertToEmployee);
router.get('/:id/resume', downloadResume);

module.exports = router;