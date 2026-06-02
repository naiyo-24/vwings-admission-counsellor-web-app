import React from 'react';
import { motion } from 'framer-motion';

const WelcomeModalNew = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#370E62] border border-white/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl" 
      >
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to VWings24x7</h2>
        <p className="text-gray-300 mb-8">Get ready to guide our next generation of aviators!</p>
        <button 
          className="bg-gradient-to-r from-[#F5C300] to-[#FFD700] text-[#370E62] font-bold py-2 px-8 rounded-xl hover:opacity-90 transition-opacity w-full" 
          onClick={onClose}
        >
          Let's Go
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomeModalNew;
