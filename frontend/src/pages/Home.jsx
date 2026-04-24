import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useJobContext } from "../context/JobContext";
import { useAuthContext } from "../context/AuthContext";

const Home = () => {
  const {
    jobs,
    loading,
    error,
    filters,
    setFilters,
    isAiMatching,
    aiSkills,
    handleResumeUpload,
    pagination,
    goToPage,
    savedJobIds,
    toggleSaveJob,
  } = useJobContext();
  const { isAuthenticated } = useAuthContext();

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
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
      handleResumeUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      setUploadedFileName(e.target.files[0].name);
      handleResumeUpload(e.target.files[0]);
    }
  };

  const companyTypeColors = {
    Product: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Service: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Startup: "bg-green-500/10 text-green-400 border-green-500/20",
    Other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-white tracking-tight">
          Find Your Next <span className="text-blue-500">Dream Career</span>
        </h1>

        {/* AI Resume Matcher Section */}
        <div className="mb-10 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg
              className="w-48 h-48 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-3 uppercase font-black tracking-widest">
              AI
            </span>
            Resume Matcher
          </h2>
          <p className="text-blue-200 mb-6 max-w-2xl text-sm">
            Drop your PDF resume and our AI instantly extracts your skills and
            shows only the most relevant jobs from our database.
          </p>

          <form
            onDragEnter={handleDrag}
            onDrop={handleDrop}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onSubmit={(e) => e.preventDefault()}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-colors cursor-pointer select-none
              ${dragActive ? "border-blue-400 bg-blue-900/20" : "border-blue-500/30 bg-[#0F172A]/50"}
              ${isAiMatching ? "opacity-50 pointer-events-none" : "hover:bg-blue-900/10"}`}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleChange}
            />
            {isAiMatching ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <p className="text-blue-300 font-medium animate-pulse">
                  Analyzing {uploadedFileName || "resume"}...
                </p>
              </div>
            ) : uploadedFileName ? (
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-500/20 p-3 rounded-full mb-3">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <p className="text-green-300 font-medium text-lg">
                  Matched! Jobs updated below.
                </p>
                <p className="text-gray-400 text-sm mt-1">{uploadedFileName}</p>
                <p className="text-blue-400 text-xs mt-3 underline">
                  Click to upload a different resume
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <svg
                  className="w-12 h-12 text-blue-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="text-gray-300 font-medium text-lg">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  PDF format only (Max 5MB)
                </p>
              </div>
            )}
          </form>

          {aiSkills?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-blue-500/20">
              <p className="text-xs text-gray-400 mb-3 font-bold uppercase tracking-widest">
                Extracted Skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {aiSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm font-semibold capitalize"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="bg-[#1E293B] p-6 rounded-3xl mb-8 shadow-2xl border border-gray-800/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "What role?",
                name: "role",
                placeholder: "e.g. Software Engineer",
                type: "text",
              },
              {
                label: "Where?",
                name: "city",
                placeholder: "e.g. Bangalore or Remote",
                type: "text",
              },
            ].map(({ label, name, placeholder }) => (
              <div key={name} className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={filters[name]}
                  onChange={handleFilterChange}
                  placeholder={placeholder}
                  className="w-full bg-[#0F172A] border border-gray-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                Job Type
              </label>
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
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                Company Type
              </label>
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

        {/* Results count */}
        {!loading && !error && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              {aiSkills?.length > 0 ? (
                <span>
                  ✨{" "}
                  <span className="text-white font-semibold">
                    {jobs.length}
                  </span>{" "}
                  AI-matched jobs for your resume
                </span>
              ) : (
                <span>
                  <span className="text-white font-semibold">
                    {pagination.total}
                  </span>{" "}
                  jobs found
                </span>
              )}
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign in to save jobs →
              </Link>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-medium animate-pulse">
                Loading jobs...
              </p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-20 text-red-400">
              Failed to load jobs. Please check your backend connection.
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => {
              const isSaved = savedJobIds.has(job._id);
              const typeColor =
                companyTypeColors[job.companyType] || companyTypeColors.Other;
              return (
                <div
                  key={job._id}
                  className="group bg-[#1E293B] border border-gray-800/50 rounded-[2rem] p-7 hover:bg-[#243147] hover:border-blue-500/30 transition-all duration-300 flex flex-col shadow-xl hover:shadow-blue-900/10"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/20 uppercase">
                        {job.company?.[0] || "C"}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm leading-tight">
                          {job.company}
                        </p>
                        {job.source && job.source !== "Manual" && (
                          <p className="text-gray-600 text-[10px]">
                            via {job.source}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.companyType && (
                        <span
                          className={`text-[9px] px-2.5 py-1 rounded-full uppercase font-black tracking-widest border ${typeColor}`}
                        >
                          {job.companyType}
                        </span>
                      )}
                      {isAuthenticated && (
                        <button
                          onClick={() => toggleSaveJob(job._id)}
                          className={`text-lg leading-none transition-all hover:scale-110 ${isSaved ? "text-yellow-400" : "text-gray-700 hover:text-yellow-400"}`}
                          title={isSaved ? "Remove from saved" : "Save job"}
                        >
                          ★
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                    {job.jobTitle}
                  </h2>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 my-4">
                    <span className="text-xs bg-gray-900/50 text-gray-400 px-2.5 py-1 rounded-lg border border-gray-800">
                      📍 {job.jobLocation}
                    </span>
                    <span className="text-xs bg-gray-900/50 text-gray-400 px-2.5 py-1 rounded-lg border border-gray-800">
                      🕒 {job.jobType}
                    </span>
                    {job.salary && job.salary !== "Not Disclosed" && (
                      <span className="text-xs bg-gray-900/50 text-gray-400 px-2.5 py-1 rounded-lg border border-gray-800">
                        💰 {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed flex-1">
                    {job.jobDescription}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3 mt-5 pt-5 border-t border-gray-800/50">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="flex-1 text-center py-3 rounded-2xl border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500/10 transition-all"
                    >
                      View Details
                    </Link>
                    <a
                      href={job.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-600">
              <div className="text-6xl mb-4 opacity-20">🔍</div>
              <p className="text-xl font-medium">No matching jobs found</p>
              <p className="text-sm opacity-60 mt-1">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading &&
          !error &&
          pagination.totalPages > 1 &&
          aiSkills?.length === 0 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>

              {Array.from(
                { length: Math.min(pagination.totalPages, 7) },
                (_, i) => {
                  const p = Math.max(1, pagination.page - 3) + i;
                  if (p > pagination.totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${p === pagination.page ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400"}`}
                    >
                      {p}
                    </button>
                  );
                },
              )}

              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Home;
