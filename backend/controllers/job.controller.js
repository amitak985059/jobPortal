
const jobModel = require('../models/job.model');
module.exports.createJob = async (req, res) => {
    try {
        const { company, jobTitle, jobDescription, jobLocation, jobType, salary, eligibleBatch, jobLink, expectedCtc } = req.body;
        const existingJob = await jobModel.findOne({jobLink});
        if(existingJob){
            return res.status(400).json({success: false, error: 'Job with same link already exists'});
        }
        const job = await new jobModel({
            company,
            jobTitle,
            jobDescription,
            jobLocation,
            jobType,
            salary,
            eligibleBatch,
            jobLink,
            expectedCtc
        });
        

        const savedJob = await job.save();
        res.status(201).json({ success: true, data: savedJob });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
module.exports.getJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find();
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
