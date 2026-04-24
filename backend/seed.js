const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/job.model');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const dummyJobs = [
    {
        company: "Google",
        jobTitle: "Software Engineer",
        jobDescription: "Develop world-class software at scale.",
        jobLocation: "Bangalore",
        jobType: "Full-time",
        salary: "₹25,00,000 - ₹40,00,000",
        eligibleBatch: "2024, 2025",
        jobLink: "https://careers.google.com",
        expectedCtc: "35 LPA",
        companyType: "Product"
    },
    {
        company: "Microsoft",
        jobTitle: "Frontend Developer",
        jobDescription: "Build immersive user experiences for millions of users.",
        jobLocation: "Hyderabad",
        jobType: "Full-time",
        salary: "₹20,00,000 - ₹35,00,000",
        eligibleBatch: "2023, 2024",
        jobLink: "https://careers.microsoft.com",
        expectedCtc: "28 LPA",
        companyType: "Product"
    },
    {
        company: "TCS",
        jobTitle: "System Engineer",
        jobDescription: "Work on large scale enterprise applications and systems.",
        jobLocation: "Pune",
        jobType: "Full-time",
        salary: "₹3,36,000 - ₹7,00,000",
        eligibleBatch: "2024",
        jobLink: "https://tcs.com/careers",
        expectedCtc: "4 LPA",
        companyType: "Service"
    },
    {
        company: "Infosys",
        jobTitle: "Power Programmer",
        jobDescription: "Solve complex business problems using advanced technologies.",
        jobLocation: "Bangalore",
        jobType: "Full-time",
        salary: "₹8,00,000 - ₹12,00,000",
        eligibleBatch: "2023, 2024",
        jobLink: "https://infosys.com/careers",
        expectedCtc: "9 LPA",
        companyType: "Service"
    },
    {
        company: "Razorpay",
        jobTitle: "Backend Intern",
        jobDescription: "Help build the next generation of payment gateways in India.",
        jobLocation: "Remote",
        jobType: "Internship",
        salary: "₹40,000 / month",
        eligibleBatch: "2025",
        jobLink: "https://razorpay.com/jobs",
        expectedCtc: "N/A",
        companyType: "Startup"
    },
    {
        company: "Cred",
        jobTitle: "Mobile Developer (React Native)",
        jobDescription: "Create smooth, beautiful animations for our mobile app.",
        jobLocation: "Bangalore",
        jobType: "Full-time",
        salary: "₹30,00,000 - ₹50,00,000",
        eligibleBatch: "Any",
        jobLink: "https://cred.club/careers",
        expectedCtc: "40 LPA",
        companyType: "Startup"
    },
    {
        company: "Amazon",
        jobTitle: "Cloud Architect",
        jobDescription: "Design scalable cloud infrastructure on AWS for enterprise clients.",
        jobLocation: "Remote",
        jobType: "Contract",
        salary: "₹1,00,000 / month",
        eligibleBatch: "All",
        jobLink: "https://amazon.jobs",
        expectedCtc: "12 LPA",
        companyType: "Product"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to MongoDB for seeding.");
        
        await Job.deleteMany({});
        console.log("Cleared existing jobs.");
        
        await Job.insertMany(dummyJobs);
        console.log(`Successfully seeded ${dummyJobs.length} jobs.`);
        
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
