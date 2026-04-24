
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
        const { type, city, companyType, role } = req.query;
        let query = {};
        
        // Build the query object dynamically based on provided filters
        if (type) query.jobType = new RegExp(type, 'i'); // e.g., 'Full-time', 'Internship'
        if (city) query.jobLocation = new RegExp(city, 'i'); // e.g., 'Bangalore', 'Remote'
        if (companyType) query.companyType = new RegExp(companyType, 'i'); // 'Product', 'Service'
        if (role) query.jobTitle = new RegExp(role, 'i'); // e.g., 'Software Engineer'

        // Find jobs matching the query, sorted by newest first
        const jobs = await jobModel.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

const pdfParse = require('pdf-parse');

module.exports.matchResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No resume file uploaded' });
        }

        // 1. Parse the PDF buffer
        const data = await pdfParse(req.file.buffer);
        const text = data.text.toLowerCase();

        const techKeywords = [
            'react', 'node', 'express', 'python', 'java', 'c\\+\\+', 'aws', 'docker', 
            'kubernetes', 'mongodb', 'sql', 'javascript', 'typescript', 'angular', 
            'vue', 'frontend', 'backend', 'full stack', 'machine learning', 'devops'
        ];
        
        const extractedSkills = techKeywords.filter(skill => text.includes(skill));

        // 3. Find jobs that mention these skills
        if (extractedSkills.length > 0) {
            const skillRegex = new RegExp(extractedSkills.join('|'), 'i');
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

        // Fallback if no skills found
        const allJobs = await jobModel.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json({ success: true, match: false, data: allJobs });

    } catch (error) {
        console.error('Resume Parse Error:', error);
        res.status(500).json({ success: false, error: 'Failed to process resume' });
    }
}
