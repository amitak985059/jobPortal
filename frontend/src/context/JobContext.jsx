import React, { createContext, useContext, useState, useEffect } from "react";
import { getJobs, matchResume } from "../services/job.service";
import { saveJobAPI, getSavedJobsAPI } from "../services/user.service";

const JobContext = createContext();

export const useJobContext = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    companyType: "",
    role: "",
  });
  const [aiSkills, setAiSkills] = useState([]);
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error'|'info' }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getJobs(filters, page);
      setJobs(data.data);
      if (data.pagination) setPagination(data.pagination);
      setAiSkills([]);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => fetchJobs(page);

  useEffect(() => {
    fetchJobs(1);
  }, [filters]);

  // Auto-load saved job IDs on mount so star buttons reflect reality immediately
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getSavedJobsAPI()
      .then((data) => {
        if (data?.success) {
          setSavedJobIds(new Set(data.data.map((j) => j._id)));
        }
      })
      .catch(() => {});
  }, []);

  const handleResumeUpload = async (file) => {
    setIsAiMatching(true);
    try {
      const data = await matchResume(file);
      if (data.success) {
        setJobs(data.data);
        if (data.skills) setAiSkills(data.skills);
        setPagination({ page: 1, totalPages: 1, total: data.data.length });
      }
    } catch (err) {
      console.error("Failed to parse resume", err);
    } finally {
      setIsAiMatching(false);
    }
  };

  const toggleSaveJob = async (jobId) => {
    try {
      const data = await saveJobAPI(jobId);
      if (data.success) {
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          data.saved ? next.add(jobId) : next.delete(jobId);
          return next;
        });
        showToast(
          data.saved ? "★ Job saved to your list!" : "Job removed from saved.",
          data.saved ? "success" : "info",
        );
      } else {
        showToast(data.error || "Something went wrong", "error");
      }
      return data;
    } catch (err) {
      console.error(err);
      showToast("Failed to save job. Please log in again.", "error");
    }
  };

  const loadSavedJobs = async () => {
    try {
      const data = await getSavedJobsAPI();
      if (data.success) {
        setSavedJobIds(new Set(data.data.map((j) => j._id)));
        return data.data;
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  const clearSavedJobs = () => setSavedJobIds(new Set());

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        error,
        filters,
        setFilters,
        aiSkills,
        isAiMatching,
        handleResumeUpload,
        pagination,
        goToPage,
        savedJobIds,
        toggleSaveJob,
        loadSavedJobs,
        clearSavedJobs,
        toast,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
