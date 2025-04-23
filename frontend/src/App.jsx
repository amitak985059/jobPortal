import './App.css'
import React from 'react'
import { Routes, Route, Link , useLocation} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/login'
import CreateJob from './pages/CreateJob'
import PrivateRoute from './pages/PrivateRoute'  // Import the PrivateRoute component
import Navbar from './pages/Navbar'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import Carousel from './pages/Carousel'
import AdminContactMessages from './pages/AdminContactMessages'

function App() {
  const location = useLocation();

  // Define routes where carousel should be hidden
  const hideCarouselRoutes = ['/contactus', '/about'];
  const shouldShowCarousel = !hideCarouselRoutes.includes(location.pathname);
  return (
    <>
      <Navbar />
      <div className="w-full bg-[#0F172A] py-6">
        {shouldShowCarousel && <Carousel />}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/createJob"
          element={
            <PrivateRoute>
              <CreateJob />
            </PrivateRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path='/contactus' element={<ContactUs />} />
        <Route path='/getContactus' element={<PrivateRoute>
              <AdminContactMessages />
            </PrivateRoute>} />

      </Routes>

    </>
  )
}

export default App
