import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Eye, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { glassmorphicStyles } from '../theme';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

const AboutUs = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto flex flex-col gap-6 pb-10"
    >
      <motion.div variants={itemVariants} className={`${glassmorphicStyles.card} p-8`}>
        <h2 className="text-[#F5C300] text-3xl font-bold mb-2">VWINGS24x7</h2>
        <p className="text-gray-300 mb-6">Empowering Teachers, Enriching Minds</p>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 px-4 py-1.5 rounded-lg font-bold text-white">48 Courses</motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 px-4 py-1.5 rounded-lg font-bold text-white">24 Partners</motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={`${glassmorphicStyles.card} p-8`}>
        <div className="flex flex-col gap-6 mb-10">
          <motion.div whileHover={{ x: 10 }} className="flex gap-4 transition-transform">
            <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              <Flag className="text-[#F5C300]" />
            </div>
            <div>
              <h3 className="text-white font-bold mb-2 text-lg">Mission</h3>
              <p className="text-gray-400">Provide quality teacher training and resources.</p>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ x: 10 }} className="flex gap-4 transition-transform">
            <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              <Eye className="text-[#F5C300]" />
            </div>
            <div>
              <h3 className="text-white font-bold mb-2 text-lg">Vision</h3>
              <p className="text-gray-400">Be the leading platform for teacher excellence.</p>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between text-center border-t border-white/10 pt-8 flex-wrap gap-4">
          <motion.div whileHover={{ scale: 1.1 }} className="flex-1">
            <h3 className="text-white text-2xl font-bold">24</h3>
            <p className="text-sm text-gray-400 mt-1">Partners</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="flex-1">
            <h3 className="text-white text-2xl font-bold">10y</h3>
            <p className="text-sm text-gray-400 mt-1">Experience</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="flex-1">
            <h3 className="text-white text-2xl font-bold">92%</h3>
            <p className="text-sm text-gray-400 mt-1">Placement</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="flex-1">
            <h3 className="text-white text-2xl font-bold">48</h3>
            <p className="text-sm text-gray-400 mt-1">Courses</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={`${glassmorphicStyles.card} p-8 flex items-center gap-6`}>
        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Director" className="w-20 h-20 rounded-full object-cover shrink-0" />
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">Dr. A. Director</h3>
          <p className="text-gray-300">"Our commitment is to uplift educators through practical training and continuous support."</p>
        </div>
        <div className="self-end italic text-gray-500">
          — Director
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={`${glassmorphicStyles.card} p-8`}>
        <h3 className="text-white font-bold text-xl mb-6">Contact Us</h3>
        <div className="flex flex-col gap-4">
          {[
            { icon: Globe, text: "https://vwings24x7.example" },
            { icon: Phone, text: "+1-555-0100" },
            { icon: Mail, text: "contact@vwings24x7.example" },
            { icon: MapPin, text: "123 Education Lane, City, Country" }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              whileHover={{ x: 10 }}
              className="flex items-center gap-4 text-gray-400 hover:text-[#F5C300] cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-[#F5C300]" />
              </div>
              <span className="font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutUs;
