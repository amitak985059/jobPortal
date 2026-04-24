const jobModel = require('../models/job.model');
const pdfParse = require('pdf-parse');

module.exports.createJob = async (req, res) => {
    try {
        const { company, jobTitle, jobDescription, jobLocation, jobType, salary, eligibleBatch, jobLink, expectedCtc } = req.body;
        const existingJob = await jobModel.findOne({jobLink});
        if(existingJob){
            return res.status(400).json({success: false, error: 'Job with same link already exists'});
        }
        const job = new jobModel({
            company, jobTitle, jobDescription, jobLocation,
            jobType, salary, eligibleBatch, jobLink, expectedCtc
        });

        const savedJob = await job.save();
        res.status(201).json({ success: true, data: savedJob });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.getJobs = async (req, res) => {
    try {
        const { type, city, companyType, role, page = 1, limit = 12 } = req.query;
        let query = {};
        
        if (type) query.jobType = new RegExp(type, 'i');
        if (city) query.jobLocation = new RegExp(city, 'i');
        if (companyType) query.companyType = new RegExp(companyType, 'i');
        if (role) query.jobTitle = new RegExp(role, 'i');

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await jobModel.countDocuments(query);
        const jobs = await jobModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: jobs,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.getJobById = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.matchResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No resume file uploaded' });
        }

        const data = await pdfParse(req.file.buffer);
        const text = data.text.toLowerCase();

        const techKeywords = [
            'react', 'node', 'express', 'python', 'java', 'aws', 'docker',
            'kubernetes', 'mongodb', 'sql', 'javascript', 'typescript', 'angular',
            'vue', 'frontend', 'backend', 'full stack', 'machine learning', 'devops',
            'golang', 'rust', 'ruby', 'rails', 'spring', 'flutter', 'swift', 'kotlin'
        ];
        
        // Safely escape special characters before building regex
        const extractedSkills = techKeywords.filter(skill => text.includes(skill));

        if (extractedSkills.length > 0) {
            const escapedSkills = extractedSkills.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const skillRegex = new RegExp(escapedSkills.join('|'), 'i');
            const matchingJobs = await jobModel.find({
                $or: [
                    { jobTitle: skillRegex },
                    { jobDescription: skillRegex }
                ]
            }).sort({ createdAt: -1 }).limit(50);
            
            return res.status(200).json({
                success: true,
                match: true,
                skills: extractedSkills,
                data: matchingJobs.length > 0 ? matchingJobs : await jobModel.find().sort({ createdAt: -1 }).limit(50)
            });
        }

        const allJobs = await jobModel.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json({ success: true, match: false, data: allJobs });

    } catch (error) {
        console.error('Resume Parse Error:', error);
        res.status(500).json({ success: false, error: 'Failed to process resume' });
    }
}

const { autoApplyToJob } = require('../services/lazyApply.service');
const userModel = require('../models/user.models');

module.exports.lazyApply = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user._id;

        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const lazyProfile = user.lazyApplyProfile || {};

        // Run Playwright worker
        const result = await autoApplyToJob(job.jobLink, user, lazyProfile);

        if (result.success) {
            return res.status(200).json({ success: true, message: result.message, screenshotUrl: result.screenshotUrl });
        } else {
            return res.status(400).json({ success: false, error: result.message });
        }

    } catch (error) {
        console.error('Lazy Apply Error:', error);
        res.status(500).json({ success: false, error: 'Failed to initiate lazy apply' });
    }
}
