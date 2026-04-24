import React, { useState, useRef } from "react";
import { useJobContext } from "../context/JobContext";

const Home = () => {
  const { jobs, loading, error, filters, setFilters, onResumeUpload, isAiMatching, aiSkills, handleResumeUpload } = useJobContext();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
      handleResumeUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
      handleResumeUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-white tracking-tight">
          Find Your Next <span className="text-blue-500">Dream Career</span>
        </h1>
        
        {/* AI Resume Matcher Section */}
        <div className="mb-10 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-3 uppercase font-black tracking-widest">New</span>
                AI Resume Matcher
            </h2>
            <p className="text-blue-200 mb-6 max-w-2xl text-sm">
                Upload your resume (PDF) and our AI will extract your skills and instantly show you the most relevant roles from our enterprise database.
            </p>
            
            <form 
                onDragEnter={handleDrag} onDrop={handleDrop} onDragLeave={handleDrag} onSubmit={(e) => e.preventDefault()}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-colors ${dragActive ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500/30 bg-[#0F172A]/50'} ${isAiMatching ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:bg-blue-900/10'}`}
                onClick={() => fileInputRef.current.click()}
            >
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleChange} />
                
                {isAiMatching ? (
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                        <p className="text-blue-300 font-medium animate-pulse">Analyzing {uploadedFileName || 'resume'}...</p>
                    </div>
                ) : uploadedFileName ? (
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-green-500/20 p-3 rounded-full mb-3">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <p className="text-green-300 font-medium text-lg">Successfully Uploaded!</p>
                        <p className="text-gray-400 text-sm mt-1">{uploadedFileName}</p>
                        <p className="text-blue-400 text-xs mt-3 underline hover:text-blue-300">Click to upload a different resume</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <svg className="w-12 h-12 text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="text-gray-300 font-medium text-lg">Click to upload or drag and drop</p>
                        <p className="text-gray-500 text-sm mt-1">PDF format only (Max 5MB)</p>
                    </div>
                )}
            </form>
            
            {aiSkills && aiSkills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-blue-500/20">
                    <p className="text-sm text-gray-400 mb-3 font-medium uppercase tracking-wider">AI Extracted Skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {aiSkills.map(skill => (
                            <span key={skill} className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Filter Section */}
        <div className="bg-[#1E293B] p-6 rounded-3xl mb-10 shadow-2xl border border-gray-800/50 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">What role?</label>
              <input
                type="text"
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                placeholder="e.g. Software Engineer"
                className="w-full bg-[#0F172A] border border-gray-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Where?</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="e.g. Bangalore or Remote"
                className="w-full bg-[#0F172A] border border-gray-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Job Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-[#0F172A] border border-gray-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Company Type</label>
              <select
                name="companyType"
                value={filters.companyType}
                onChange={handleFilterChange}
                className="w-full bg-[#0F172A] border border-gray-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">All Companies</option>
                <option value="Product">Product Based</option>
                <option value="Service">Service Based</option>
                <option value="Startup">Startup</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {aiSkills && aiSkills.length > 0 && (
             <h3 className="text-2xl font-bold text-white mb-6">✨ Top Job Matches Based On Your Resume</h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading && !isAiMatching ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-medium animate-pulse">Loading premium jobs...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-20 text-red-400">
              Failed to load jobs. Please check your backend connection.
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className="group bg-[#1E293B] border border-gray-800/50 rounded-[2rem] p-8 hover:bg-[#243147] hover:border-blue-500/30 transition-all duration-300 flex flex-col shadow-xl hover:shadow-blue-900/10"
              >
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-600/10 p-3 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg uppercase">
                        {job.company ? job.company[0] : 'C'}
                      </div>
                    </div>
                    {job.companyType && (
                      <span className="text-[9px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full uppercase font-black tracking-[0.1em] border border-blue-500/20">
                        {job.companyType}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {job.jobTitle}
                  </h2>
                  <p className="text-gray-400 font-semibold mb-4">{job.company}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs bg-gray-900/50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-800">
                      📍 {job.jobLocation}
                    </span>
                    <span className="text-xs bg-gray-900/50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-800">
                      🕒 {job.jobType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-900/30 p-3 rounded-2xl border border-gray-800/30">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Salary</p>
                      <p className="text-sm text-gray-300 font-medium">{job.salary}</p>
                    </div>
                    <div className="bg-gray-900/30 p-3 rounded-2xl border border-gray-800/30">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Eligibility</p>
                      <p className="text-sm text-gray-300 font-medium">{job.eligibleBatch}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4 italic">
                    {job.jobDescription}
                  </p>
                </div>
                
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  Direct Apply Now
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-600">
              <div className="text-6xl mb-4 opacity-20">🔍</div>
              <p className="text-xl font-medium">No matching jobs found</p>
              <p className="text-sm opacity-60">Try adjusting your filters or checking back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
