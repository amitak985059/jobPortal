const express = require('express');
const router = express.Router();

const {createJob, getJobs, matchResume} = require('../controllers/job.controller');
const multer = require('multer');

// Store file in memory to parse it directly without saving to disk
const upload = multer({ storage: multer.memoryStorage() });

router.post('/createjob', createJob);
router.get('/getjobs', getJobs);
router.post('/match-resume', upload.single('resume'), matchResume);

module.exports = router;