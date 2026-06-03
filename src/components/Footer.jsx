import React from 'react';

const Footer = () => {
  return (
    <footer 
      className="mt-10 p-6 text-center text-white rounded-[20px] border border-[#C0BEC5]/30 bg-[#9E161B] backdrop-blur-md shadow-lg"
    >
      <p>&copy; {new Date().getFullYear()} VWings24x7. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
