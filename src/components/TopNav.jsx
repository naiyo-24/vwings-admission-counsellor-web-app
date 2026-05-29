import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Info, AlertCircle, User } from 'lucide-react';
import { glassmorphicStyles } from '../theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const TopNav = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/announcements/get-all');
        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter(a => 
            (a.role.toLowerCase() === 'counsellor' || a.role.toLowerCase() === 'all' || a.role.toLowerCase() === 'everyone') && 
            a.active_status !== false
          );
          
          const sorted = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setNotifications(sorted);
          if (sorted.length > 0) setHasUnread(true);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

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

    fetchNotifications();
    loadProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
    setHasUnread(false);
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

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

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <button 
            onClick={handleNotificationClick}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors ${glassmorphicStyles.light}`}
          >
            {hasUnread ? <BellRing size={20} className="text-[#F5C300]" /> : <Bell size={20} />}
            {hasUnread && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#370E62]"></span>
            )}
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 right-14 w-80 rounded-2xl bg-[#240A40] border border-[#F5C300]/50 shadow-2xl overflow-hidden z-[100]"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Bell size={16} className="text-[#F5C300]" />
                    Notifications
                  </h3>
                  <span className="text-xs bg-[#F5C300]/20 text-[#F5C300] px-2 py-1 rounded-full font-medium">
                    {notifications.length} New
                  </span>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="flex flex-col divide-y divide-white/5">
                      {notifications.map((notif) => (
                        <div key={notif.announcement_id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#F5C300]/10 rounded-lg text-[#F5C300] group-hover:bg-[#F5C300]/20 transition-colors">
                              {notif.type === 'alert' ? <AlertCircle size={16} /> : <Info size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white mb-1">{notif.headline}</p>
                              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{notif.description}</p>
                              <p className="text-[10px] text-gray-500 mt-2 font-medium">{getTimeAgo(notif.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center">
                      <Bell size={32} className="text-gray-500 mb-3 opacity-50" />
                      <p className="text-gray-400 text-sm font-medium">No new notifications</p>
                      <p className="text-gray-500 text-xs mt-1">You're all caught up!</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-white/10 bg-black/20 text-center">
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

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
