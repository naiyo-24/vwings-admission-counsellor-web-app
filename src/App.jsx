import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Enquiries from './pages/Enquiries';
import Admissions from './pages/Admissions';
import Courses from './pages/Courses';
import CommissionSlips from './pages/CommissionSlips';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import HelpCenter from './pages/HelpCenter';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('counsellorData') !== null;
  });

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <Login onLogin={(data) => {
              localStorage.setItem('counsellorData', JSON.stringify(data));
              setIsAuthenticated(true);
            }} /> : 
            <Navigate to="/" />
          } 
        />
        
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Layout onLogout={() => {
              localStorage.removeItem('counsellorData');
              setIsAuthenticated(false);
            }} /> : 
            <Navigate to="/login" />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="courses" element={<Courses />} />
          <Route path="commissions" element={<CommissionSlips />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="help-center" element={<HelpCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
