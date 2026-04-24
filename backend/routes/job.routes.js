const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, matchResume } = require('../controllers/job.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/createjob', createJob);
router.get('/getjobs', getJobs);
router.get('/:id', getJobById);
router.post('/match-resume', upload.single('resume'), matchResume);
router.post('/:id/lazy-apply', authMiddleware, require('../controllers/job.controller').lazyApply);

module.exports = router;