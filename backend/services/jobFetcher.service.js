const cron = require('node-cron');
const axios = require('axios');
const jobModel = require('../models/job.model');

// This function acts as an automated aggregator to fetch real jobs from public APIs
const fetchJobsFromAPI = async () => {
    console.log('Starting automated job fetch process...');
    
    try {
        // Using Remotive.io's completely free, public API (No API Key required)
        // It provides remote tech jobs from around the world.
        console.log('Fetching live jobs from Remotive API...');
        const response = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=50');
        const externalJobs = response.data.jobs;
        
        let newJobsCount = 0;

        for (const job of externalJobs) {
            // 1. Check if job already exists using the apply link
            const existingJob = await jobModel.findOne({ jobLink: job.url });
            
            if (!existingJob) {
                // 2. Logic to categorize Company Type based on name
                let determinedCompanyType = 'Other';
                const serviceCompanies = ['tcs', 'infosys', 'wipro', 'hcl', 'cognizant', 'accenture', 'capgemini'];
                
                if (job.company_name) {
                    if (serviceCompanies.some(c => job.company_name.toLowerCase().includes(c))) {
                        determinedCompanyType = 'Service';
                    } else {
                        // For a tech API, most others are product or startups
                        determinedCompanyType = 'Product'; 
                    }
                }

                // 3. Clean up the HTML description to plain text (simple regex)
                let cleanDescription = job.description ? job.description.replace(/<[^>]*>?/gm, '') : 'No description provided.';
                cleanDescription = cleanDescription.substring(0, 800) + '...';

                // 4. Map external API fields to your Mongoose schema
                const newJob = new jobModel({
                    company: job.company_name || 'Confidential',
                    jobTitle: job.title || 'Software Engineer',
                    jobDescription: cleanDescription,
                    jobLocation: job.candidate_required_location || 'Remote',
                    jobType: job.job_type ? job.job_type.replace('_', ' ') : 'Full-time',
                    salary: job.salary || 'Not Disclosed',
                    eligibleBatch: 'Any Batch', // Not provided by most APIs
                    jobLink: job.url || '#',
                    expectedCtc: 'Not Disclosed',
                    companyType: determinedCompanyType
                });
                
                await newJob.save();
                newJobsCount++;
            }
        }
        console.log(`✅ Success: Fetched and saved ${newJobsCount} new real jobs into the database.`);
    } catch (error) {
        console.error('❌ Error fetching external jobs:', error.message);
    }
};

// Initialize the cron job
const initJobFetcher = () => {
    console.log('Initializing Enterprise Job Fetcher Cron...');
    
    // Schedule the cron job to run every 6 hours
    cron.schedule('0 */6 * * *', () => {
        fetchJobsFromAPI();
    });
};

module.exports = { initJobFetcher, fetchJobsFromAPI };
