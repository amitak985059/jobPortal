import './App.css'
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/login'
import Register from './pages/Register'
import CreateJob from './pages/CreateJob'
import PrivateRoute from './pages/PrivateRoute'
import Navbar from './pages/Navbar'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import Carousel from './pages/Carousel'
import AdminContactMessages from './pages/AdminContactMessages'
import JobDetail from './pages/JobDetail'
import SavedJobs from './pages/SavedJobs'

function App() {
  const location = useLocation();

  const hideCarouselRoutes = ['/contactus', '/about', '/createJob', '/login', '/register'];
  const shouldShowCarousel = !hideCarouselRoutes.includes(location.pathname) && !location.pathname.startsWith('/jobs/');

  return (
    <>
      <Navbar />
      {shouldShowCarousel && (
        <div className="w-full bg-[#0F172A] py-6">
          <Carousel />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route
          path="/createJob"
          element={
            <PrivateRoute>
              <CreateJob />
            </PrivateRoute>
          }
        />
        <Route
          path="/getContactus"
          element={
            <PrivateRoute>
              <AdminContactMessages />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
