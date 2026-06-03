import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Info, AlertCircle, User, Menu } from 'lucide-react';
import { glassmorphicStyles } from '../theme';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import GlobalSearch from './GlobalSearch';

const TopNav = ({ toggleSidebar }) => {
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
    <header className="px-4 md:px-8 pt-4 pb-2 z-30 relative">
      <div className={`flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 px-4 md:px-6 rounded-2xl ${glassmorphicStyles.card} shadow-lg relative gap-3 md:gap-0`}>
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={toggleSidebar} className="md:hidden text-[#1A2134] p-1 hover:bg-black/5 rounded-lg transition-colors shrink-0">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#1A2134] truncate max-w-[150px] sm:max-w-[300px] md:max-w-none">
                Welcome back, {profile?.full_name ? profile.full_name.split(' ')[0] : 'Counsellor'}! <span className="hidden md:inline">✈️</span>
              </h1>
              <p className="hidden md:block text-[#373F52] text-sm mt-1">Manage your admissions and enquiries effectively.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative md:hidden">
            <NotificationBell role="counsellor" userId={profile?.counsellor_id || "counsellor"} />
            <Link to="/profile" className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#C0BEC5] bg-[#1A2134] border border-[#C0BEC5] cursor-pointer overflow-hidden hover:opacity-80 transition-opacity">
              {profile?.profile_photo ? (
                <img src={getProfileImageUrl(profile.profile_photo)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">{getInitials(profile?.full_name)}</span>
              )}
            </Link>
          </div>
        </div>

        <div className="w-full md:w-auto md:flex-1 md:max-w-md md:mx-6">
          <GlobalSearch />
        </div>

        <div className="hidden md:flex items-center gap-4 relative shrink-0">
          <NotificationBell role="counsellor" userId={profile?.counsellor_id || "counsellor"} />

          <Link to="/profile" className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#C0BEC5] bg-[#1A2134] border border-[#C0BEC5] cursor-pointer overflow-hidden hover:opacity-80 transition-opacity">
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
