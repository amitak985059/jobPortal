const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, matchResume } = require('../controllers/job.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/createjob', createJob);
router.get('/getjobs', getJobs);
router.get('/:id', getJobById);
router.post('/match-resume', upload.single('resume'), matchResume);

module.exports = router;