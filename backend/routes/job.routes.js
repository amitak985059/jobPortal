const express = require('express');
const router = express.Router();

const {createJob, getJobs} = require('../controllers/job.controller');

router.post('/createjob', createJob);
router.get('/getjobs', getJobs);

module.exports = router;