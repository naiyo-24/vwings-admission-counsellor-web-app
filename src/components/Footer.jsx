import React from 'react';

const Footer = () => {
  return (
    <footer 
      className="mt-10 p-6 text-center text-white/70 rounded-[20px] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
      style={{
        background: 'rgba(55, 14, 98, 0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <p>&copy; {new Date().getFullYear()} VWings24x7. All rights reserved.</p>
    </footer>
  );
};

export default Footer;