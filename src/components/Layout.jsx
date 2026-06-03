import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import AdBanner from './AdBanner';
import Footer from './Footer';

const Layout = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FEFEFE] text-[#1A2134] flex relative">
      <Sidebar onLogout={onLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative w-full">
        <TopNav toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-8 pt-4 z-10 relative">
          <AdBanner />
          <Outlet />
          <Footer />
        </main>
        {/* Background Decorative Elements */}
        <div className="fixed top-[15%] left-[15%] w-[800px] h-[800px] bg-[#907C84] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 z-0 pointer-events-none"></div>
        <div className="fixed bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[#7B0771] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 z-0 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Layout;
