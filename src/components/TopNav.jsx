import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Info, AlertCircle, User } from 'lucide-react';
import { glassmorphicStyles } from '../theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const TopNav = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = () => {
      const storedData = localStorage.getItem('counsellorData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setProfile(parsedData);
        } catch (err) {
          console.error("Failed to parse profile data:", err);
        }
      }
    };
    loadProfile();
  }, []);

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:8000/${path}`;
  };

  const getInitials = (name) => {
    if (!name) return 'AC';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="px-8 pt-4 pb-2 z-50 relative">
      <div className={`flex items-center justify-between p-4 px-6 rounded-2xl ${glassmorphicStyles.card} shadow-lg relative`}>
        <div>
          <h1 className="text-xl font-bold text-white">
            Welcome back, {profile?.full_name ? profile.full_name.split(' ')[0] : 'Counsellor'}! ✈️
          </h1>
          <p className="text-gray-300 text-sm mt-1">Manage your admissions and enquiries effectively.</p>
        </div>

        <div className="flex items-center gap-4 relative">
          <NotificationBell role="counsellor" userId={profile?.counsellor_id || "counsellor"} />

          <Link to="/profile" className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#F5C300] bg-[#370E62] border border-[#F5C300] cursor-pointer overflow-hidden hover:opacity-80 transition-opacity">
            {profile?.profile_photo ? (
              <img src={getProfileImageUrl(profile.profile_photo)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(profile?.full_name)}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
