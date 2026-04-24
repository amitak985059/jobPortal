import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useJobContext } from "../context/JobContext";

const Profile = () => {
  const { isAuthenticated, authUser, logout } = useAuthContext();
  const { loadSavedJobs, toggleSaveJob, savedJobIds } = useJobContext();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadSavedJobs().then((jobs) => {
      setSavedJobs(jobs);
      setLoading(false);
    });
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const initials = authUser?.name
    ? authUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const joinedDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#162032] border border-gray-800/50 rounded-[2rem] p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-900/40 flex-shrink-0">
              {initials}
            </div>
            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-extrabold text-white mb-1">
                {authUser?.name}
              </h1>
              <p className="text-gray-400 text-sm mb-3">{authUser?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest border ${authUser?.role === "admin" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : "bg-blue-500/15 text-blue-300 border-blue-500/30"}`}
                >
                  {authUser?.role || "user"}
                </span>
                {joinedDate && (
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-800/60 text-gray-400 border border-gray-700/50">
                    📅 Member since {joinedDate}
                  </span>
                )}
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  ★ {savedJobs.length} Saved Job
                  {savedJobs.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {/* Actions */}
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-500/50 text-gray-300 hover:text-red-400 text-sm font-bold rounded-xl transition-all flex-shrink-0"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Saved Jobs",
              value: savedJobs.length,
              icon: "★",
              color: "text-yellow-400",
            },
            {
              label: "Account Type",
              value: authUser?.role === "admin" ? "Admin" : "Job Seeker",
              icon: "👤",
              color: "text-blue-400",
            },
            {
              label: "Status",
              value: "Active",
              icon: "✅",
              color: "text-green-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1E293B] border border-gray-800/50 rounded-2xl p-5 text-center"
            >
              <div className={`text-2xl mb-1 ${stat.color}`}>{stat.icon}</div>
              <div className="text-xl font-extrabold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Saved Jobs Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-white">
              Your Saved Jobs
            </h2>
            <Link
              to="/saved-jobs"
              className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-16 bg-[#1E293B] border border-gray-800/50 rounded-[2rem]">
              <div className="text-5xl mb-3 opacity-30">🔖</div>
              <p className="text-gray-400 font-medium">No saved jobs yet</p>
              <Link
                to="/"
                className="mt-4 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.slice(0, 6).map((job) => (
                <div
                  key={job._id}
                  className="group bg-[#1E293B] border border-gray-800/50 rounded-[1.5rem] p-5 hover:border-blue-500/30 hover:bg-[#243147] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/20 uppercase flex-shrink-0">
                        {job.company?.[0] || "C"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {job.jobTitle}
                        </h3>
                        <p className="text-gray-500 text-xs">{job.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await toggleSaveJob(job._id);
                        setSavedJobs((prev) =>
                          prev.filter((j) => j._id !== job._id),
                        );
                      }}
                      className="text-yellow-400 hover:text-gray-500 transition-colors text-lg flex-shrink-0"
                      title="Remove"
                    >
                      ★
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                    <span className="text-[11px] bg-gray-900/50 text-gray-400 px-2 py-0.5 rounded-lg border border-gray-800">
                      📍 {job.jobLocation}
                    </span>
                    <span className="text-[11px] bg-gray-900/50 text-gray-400 px-2 py-0.5 rounded-lg border border-gray-800">
                      🕒 {job.jobType}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="flex-1 text-center py-2 rounded-xl border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-500/10 transition-all"
                    >
                      View Details
                    </Link>
                    <a
                      href={job.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          {savedJobs.length > 6 && (
            <div className="text-center mt-6">
              <Link
                to="/saved-jobs"
                className="px-6 py-3 bg-[#1E293B] border border-gray-700 hover:border-blue-500/50 text-gray-300 hover:text-blue-400 font-bold rounded-xl transition-all text-sm"
              >
                View {savedJobs.length - 6} more saved jobs →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
