import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import AdBanner from './AdBanner';
import Footer from './Footer';

const Layout = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#370E62] to-[#B6007D] flex">
      <Sidebar onLogout={onLogout} />
      
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-8 pt-4 z-10 relative">
          <AdBanner />
          <Outlet />
          <Footer />
        </main>
        {/* Background Decorative Elements */}
        <div className="fixed top-[-10%] right-[-5%] w-96 h-96 bg-[#B6007D] rounded-full mix-blend-multiply filter blur-[128px] opacity-50 z-0 pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[20%] w-96 h-96 bg-[#F5C300] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 z-0 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Layout;
