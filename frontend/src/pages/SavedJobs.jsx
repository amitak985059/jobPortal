import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobContext } from '../context/JobContext';
import { useAuthContext } from '../context/AuthContext';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loadSavedJobs, toggleSaveJob, savedJobIds } = useJobContext();
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-gray-400 px-4">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-xl font-bold text-white mb-2">Please sign in to view saved jobs</p>
        <div className="flex gap-4 mt-4">
          <Link to="/login" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all">Login</Link>
          <Link to="/register" className="px-6 py-3 bg-gray-800 border border-gray-700 text-white font-bold rounded-2xl hover:bg-gray-700 transition-all">Sign Up</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white">Saved Jobs</h1>
          <p className="text-gray-400 mt-2">
            Hi <span className="text-blue-400 font-semibold">{authUser?.name}</span> — you have {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <div className="text-6xl mb-4 opacity-30">🔖</div>
            <p className="text-xl font-medium text-gray-400">No saved jobs yet</p>
            <p className="text-sm opacity-60 mt-1">Browse jobs and click the save button to bookmark them here.</p>
            <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all">Browse Jobs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedJobs.map(job => (
              <div key={job._id} className="group bg-[#1E293B] border border-gray-800/50 rounded-[2rem] p-7 hover:bg-[#243147] hover:border-blue-500/30 transition-all duration-300 flex flex-col shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg uppercase">
                    {job.company[0]}
                  </div>
                  <button
                    onClick={async () => {
                      await toggleSaveJob(job._id);
                      setSavedJobs(prev => prev.filter(j => j._id !== job._id));
                    }}
                    className="text-yellow-400 hover:text-gray-400 transition-colors text-lg"
                    title="Remove from saved"
                  >★</button>
                </div>

                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">{job.jobTitle}</h2>
                <p className="text-gray-400 text-sm font-semibold mb-3">{job.company}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-gray-900/50 text-gray-400 px-2.5 py-1 rounded-lg border border-gray-800">📍 {job.jobLocation}</span>
                  <span className="text-xs bg-gray-900/50 text-gray-400 px-2.5 py-1 rounded-lg border border-gray-800">🕒 {job.jobType}</span>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-800/50">
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
                    className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all"
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
