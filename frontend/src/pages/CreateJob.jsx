import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateJob = () => {
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState('');
    const [eligibleBatch, setEligibleBatch] = useState('');
    const [jobLink, setJobLink] = useState('');
    const [expectedCtc, setExpectedCtc] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
            const response = await axios.post('/jobs/createjob', {
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
            console.log(response.data);
            setCompany('');
            setJobTitle('');
            setJobDescription('');
            setJobLocation('');
            setJobType('');
            setSalary('');
            setEligibleBatch('');
            setJobLink('');
            setExpectedCtc('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1745173036546-c56551790fb8?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Floating Polygons */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="polygon bg-purple-400 opacity-60 animate-float1"></div>
                <div className="polygon bg-pink-400 opacity-60 animate-float2"></div>
            </div>

            {/* Job Form */}
            <div className="relative bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full z-10">
                <h1 className="text-3xl font-bold text-center mb-6">Create a Job</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} className="input" />
                    <input type="text" placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="input" />
                    <textarea placeholder="Job Description" value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="input" />
                    <input type="text" placeholder="Job Location" value={jobLocation} onChange={e => setJobLocation(e.target.value)} className="input" />
                    <input type="text" placeholder="Job Type" value={jobType} onChange={e => setJobType(e.target.value)} className="input" />
                    <input type="text" placeholder="Salary" value={salary} onChange={e => setSalary(e.target.value)} className="input" />
                    <input type="text" placeholder="Eligible Batch" value={eligibleBatch} onChange={e => setEligibleBatch(e.target.value)} className="input" />
                    <input type="text" placeholder="Job Link" value={jobLink} onChange={e => setJobLink(e.target.value)} className="input" />
                    <input type="text" placeholder="Expected CTC" value={expectedCtc} onChange={e => setExpectedCtc(e.target.value)} className="input" />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Create Job</button>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;
