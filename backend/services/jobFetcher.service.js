const cron = require('node-cron');
const axios = require('axios');
const jobModel = require('../models/job.model');

// Helper to map a raw job object into our schema and save
const saveJobIfNew = async (linkField, jobData) => {
    const existing = await jobModel.findOne({ jobLink: linkField });
    if (!existing) {
        await new jobModel(jobData).save();
        return true;
    }
    return false;
};

// --- Source 1: Remotive (free, no key, remote tech jobs) ---
const fetchFromRemotive = async () => {
    const response = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=50');
    const jobs = response.data.jobs;
    let count = 0;
    const serviceCompanies = ['tcs', 'infosys', 'wipro', 'hcl', 'cognizant', 'accenture', 'capgemini'];

    for (const job of jobs) {
        let companyType = 'Product';
        if (job.company_name && serviceCompanies.some(c => job.company_name.toLowerCase().includes(c))) {
            companyType = 'Service';
        }
        let desc = (job.description || 'No description.').replace(/<[^>]*>?/gm, '');
        desc = desc.substring(0, 1000) + '...';

        const saved = await saveJobIfNew(job.url, {
            company: job.company_name || 'Confidential',
            jobTitle: job.title || 'Software Engineer',
            jobDescription: desc,
            jobLocation: job.candidate_required_location || 'Remote',
            jobType: job.job_type ? job.job_type.replace('_', ' ') : 'Full-time',
            salary: job.salary || 'Not Disclosed',
            eligibleBatch: 'Any Batch',
            jobLink: job.url,
            expectedCtc: 'Not Disclosed',
            companyType,
            source: 'Remotive'
        });
        if (saved) count++;
    }
    return count;
};

// --- Source 2: Arbeitnow (free, no key, European & remote tech jobs) ---
const fetchFromArbeitnow = async () => {
    const response = await axios.get('https://www.arbeitnow.com/api/job-board-api');
    const jobs = response.data.data;
    let count = 0;

    for (const job of jobs) {
        let desc = (job.description || 'No description.').replace(/<[^>]*>?/gm, '');
        desc = desc.substring(0, 1000) + '...';

        const saved = await saveJobIfNew(job.url, {
            company: job.company_name || 'Confidential',
            jobTitle: job.title || 'Software Engineer',
            jobDescription: desc,
            jobLocation: job.location || 'Remote',
            jobType: job.remote ? 'Full-time Remote' : 'Full-time',
            salary: 'Not Disclosed',
            eligibleBatch: 'Any Batch',
            jobLink: job.url,
            expectedCtc: 'Not Disclosed',
            companyType: 'Product',
            source: 'Arbeitnow'
        });
        if (saved) count++;
    }
    return count;
};

// Main orchestrator — calls all sources
const fetchJobsFromAPI = async () => {
    console.log('🚀 Starting multi-source job aggregation...');

    try {
        const [remotiveCount, arbeitnowCount] = await Promise.allSettled([
            fetchFromRemotive(),
            fetchFromArbeitnow()
        ]);

        const r = remotiveCount.status === 'fulfilled' ? remotiveCount.value : 0;
        const a = arbeitnowCount.status === 'fulfilled' ? arbeitnowCount.value : 0;

        console.log(`✅ Aggregation complete: +${r} from Remotive, +${a} from Arbeitnow`);
    } catch (error) {
        console.error('❌ Fatal aggregation error:', error.message);
    }
};

const initJobFetcher = () => {
    console.log('Initializing Enterprise Job Fetcher Cron...');
    cron.schedule('0 */6 * * *', () => fetchJobsFromAPI());
};

module.exports = { initJobFetcher, fetchJobsFromAPI };
