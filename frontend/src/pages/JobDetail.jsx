import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobByIdAPI } from '../services/user.service';
import { useJobContext } from '../context/JobContext';
import { useAuthContext } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleSaveJob, savedJobIds } = useJobContext();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getJobByIdAPI(id);
        setJob(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-gray-400">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-xl font-medium">Job not found</p>
        <Link to="/" className="mt-4 text-blue-400 hover:underline">← Back to Jobs</Link>
      </div>
    );
  }

  const isSaved = savedJobIds.has(job._id);

  const companyTypeColors = {
    Product: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Service: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    Startup: 'bg-green-500/10 text-green-400 border-green-500/30',
    Other: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  };
  const typeColor = companyTypeColors[job.companyType] || companyTypeColors.Other;

  return (
    <div className="min-h-screen bg-[#0F172A] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to Jobs
        </Link>

        {/* Header Card */}
        <div className="bg-[#1E293B] border border-gray-800/50 rounded-3xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-3xl font-bold text-blue-400 border border-blue-500/20 uppercase flex-shrink-0">
                {job.company[0]}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{job.jobTitle}</h1>
                <p className="text-gray-400 font-semibold text-lg mt-1">{job.company}</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              {isAuthenticated && (
                <button
                  onClick={() => toggleSaveJob(job._id)}
                  className={`px-5 py-3 rounded-2xl font-bold border transition-all ${isSaved ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-blue-500/50'}`}
                >
                  {isSaved ? '★ Saved' : '☆ Save Job'}
                </button>
              )}
              <a
                href={job.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                Apply Now →
              </a>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-800/50">
            <span className="text-sm px-3 py-1.5 rounded-xl bg-gray-900/50 text-gray-300 border border-gray-800">📍 {job.jobLocation}</span>
            <span className="text-sm px-3 py-1.5 rounded-xl bg-gray-900/50 text-gray-300 border border-gray-800">🕒 {job.jobType}</span>
            {job.salary !== 'Not Disclosed' && (
              <span className="text-sm px-3 py-1.5 rounded-xl bg-gray-900/50 text-gray-300 border border-gray-800">💰 {job.salary}</span>
            )}
            {job.companyType && (
              <span className={`text-sm px-3 py-1.5 rounded-xl border font-semibold ${typeColor}`}>{job.companyType}</span>
            )}
            {job.source && job.source !== 'Manual' && (
              <span className="text-sm px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">🔗 via {job.source}</span>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Salary', value: job.salary },
            { label: 'Eligible Batch', value: job.eligibleBatch },
            { label: 'Expected CTC', value: job.expectedCtc || 'N/A' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#1E293B] border border-gray-800/50 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{label}</p>
              <p className="text-white font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-[#1E293B] border border-gray-800/50 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Job Description</h2>
          <div className="text-gray-400 leading-relaxed whitespace-pre-wrap">
            {job.jobDescription}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-block text-center px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Apply Directly on Company Site →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
