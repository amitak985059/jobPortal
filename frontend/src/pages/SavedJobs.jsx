import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useJobContext } from "../context/JobContext";
import { useAuthContext } from "../context/AuthContext";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const { loadSavedJobs, toggleSaveJob } = useJobContext();
  const { isAuthenticated, authUser } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      const jobs = await loadSavedJobs();
      setSavedJobs(jobs);
      setLoading(false);
    };
    fetch();
  }, [isAuthenticated]);

  const handleRemove = async (jobId) => {
    setRemovingId(jobId);
    await toggleSaveJob(jobId);
    setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    setRemovingId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-gray-400 px-4">
        <div className="bg-[#1E293B] border border-gray-800/50 rounded-[2rem] p-12 text-center max-w-md shadow-2xl">
          <div className="text-7xl mb-5">🔒</div>
          <p className="text-2xl font-bold text-white mb-2">
            Sign in to view saved jobs
          </p>
          <p className="text-gray-500 text-sm mb-7">
            Keep track of jobs you're interested in by saving them from the job
            listings.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-7 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-7 py-3 bg-gray-800 border border-gray-700 text-white font-bold rounded-2xl hover:bg-gray-700 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm animate-pulse">
            Loading your saved jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              <span className="text-yellow-400">★</span> Saved Jobs
            </h1>
            <p className="text-gray-400 mt-2">
              Hi{" "}
              <span className="text-blue-400 font-semibold">
                {authUser?.name?.split(" ")[0]}
              </span>{" "}
              — you have{" "}
              <span className="text-white font-bold">{savedJobs.length}</span>{" "}
              saved job{savedJobs.length !== 1 ? "s" : ""}.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/profile"
              className="px-5 py-2.5 bg-[#1E293B] border border-gray-700 hover:border-blue-500/40 text-gray-300 hover:text-blue-400 font-bold text-sm rounded-xl transition-all"
            >
              👤 Profile
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Browse Jobs →
            </Link>
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#1E293B] border border-gray-800/50 rounded-[2rem] text-gray-600">
            <div className="text-7xl mb-5 opacity-20">🔖</div>
            <p className="text-xl font-bold text-gray-400">No saved jobs yet</p>
            <p className="text-sm opacity-60 mt-1 text-center max-w-xs">
              Browse jobs and click the ★ star button to bookmark them here.
            </p>
            <Link
              to="/"
              className="mt-8 px-7 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
            >
              Discover Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <div
                key={job._id}
                className={`group bg-[#1E293B] border border-gray-800/50 rounded-[2rem] p-7 hover:bg-[#243147] hover:border-blue-500/30 transition-all duration-300 flex flex-col shadow-xl hover:shadow-blue-900/10 ${removingId === job._id ? "opacity-40 scale-95" : ""}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/20 uppercase">
                      {job.company?.[0] || "C"}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">
                        {job.company}
                      </p>
                      {job.companyType && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                          {job.companyType}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(job._id)}
                    disabled={removingId === job._id}
                    className="text-yellow-400 hover:text-gray-400 transition-colors text-xl leading-none hover:scale-90 active:scale-75 duration-150"
                    title="Remove from saved"
                  >
                    ★
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {job.jobTitle}
                </h2>

                {/* Description */}
                {job.jobDescription && (
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1 mb-3 leading-relaxed">
                    {job.jobDescription}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto mb-4">
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

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-800/50">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex-1 text-center py-2.5 rounded-xl border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500/10 transition-all"
                  >
                    View Details
                  </Link>
                  <a
                    href={job.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
