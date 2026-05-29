import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, BookOpen, Receipt, User, LogOut, Info, HelpCircle } from 'lucide-react';
import { glassmorphicStyles } from '../theme';

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Enquiries', path: '/enquiries' },
    { icon: UserCheck, label: 'Admissions', path: '/admissions' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Receipt, label: 'Commission Slips', path: '/commissions' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Info, label: 'About Us', path: '/about-us' },
    { icon: HelpCircle, label: 'Help Center', path: '/help-center' },
  ];

  const [counsellorData, setCounsellorData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('counsellorData');
    if (data) {
      try {
        setCounsellorData(JSON.parse(data));
      } catch (e) {
        console.error("Error parsing counsellor data", e);
      }
    }
  }, []);

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 border-r border-white/10 flex flex-col ${glassmorphicStyles.dark} bg-[#370E62]/80 z-20`}>
      <div className="flex items-center gap-3 p-6">
        <img src="/assets/V-Wings_Logo_nobg.png" alt="Logo" className="w-14 h-14 object-contain" />
        <h2 className="text-xl font-bold text-[#F5C300]">VWings24x7</h2>
      </div>

      {counsellorData && (
        <div className="px-4 pb-4 border-b border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/10 shadow-lg">
            <div className="w-12 h-12 rounded-full border-2 border-[#F5C300] overflow-hidden bg-[#370E62] shrink-0">
              {counsellorData.profile_photo ? (
                <img 
                  src={counsellorData.profile_photo.startsWith('http') ? counsellorData.profile_photo : `http://localhost:8000/${counsellorData.profile_photo}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="text-[#F5C300] w-full h-full p-2" />
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <h3 className="text-white font-bold text-sm truncate">{counsellorData.full_name || counsellorData.username}</h3>
              <p className="text-gray-400 text-xs truncate uppercase tracking-wider">{counsellorData.counsellor_id}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive && item.path === window.location.pathname
                ? 'bg-gradient-to-r from-[#370E62] to-[#B6007D] border border-white/20 text-white font-medium shadow-lg' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-white/10 hover:text-red-300 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
