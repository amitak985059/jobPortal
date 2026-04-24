import React, { createContext, useContext, useState, useEffect } from 'react';
import { getJobs, matchResume } from '../services/job.service';

const JobContext = createContext();

export const useJobContext = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState({ city: '', type: '', companyType: '', role: '' });
  const [aiSkills, setAiSkills] = useState([]);
  const [isAiMatching, setIsAiMatching] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs(filters);
      setJobs(data.data);
      setAiSkills([]); // Clear AI matched skills when a new normal filter is applied
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Whenever filters change, re-fetch the jobs
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleResumeUpload = async (file) => {
    setIsAiMatching(true);
    try {
      const data = await matchResume(file);
      if (data.success) {
        setJobs(data.data);
        if (data.skills) setAiSkills(data.skills);
      }
    } catch (err) {
      console.error("Failed to parse resume", err);
    } finally {
      setIsAiMatching(false);
    }
  };

  return (
    <JobContext.Provider value={{
      jobs, loading, error, filters, setFilters,
      aiSkills, isAiMatching, handleResumeUpload, fetchJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};
