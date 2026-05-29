import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { glassmorphicStyles } from '../theme';

const AdBanner = () => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/ads/get-all');
        if (response.ok) {
          const data = await response.json();
          const activeAds = data.filter(a => a.active_status);
          if (activeAds.length > 0) {
            // Pick a random ad
            const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
            setAd(randomAd);
          }
        }
      } catch (err) {
        console.error("Failed to fetch ads", err);
      }
    };
    fetchAds();
  }, []);

  if (!ad) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 p-4 flex flex-col md:flex-row justify-between items-start md:items-center rounded-2xl ${glassmorphicStyles.card} border-[#F5C300]/30 shadow-lg`}
        style={{ background: 'linear-gradient(90deg, rgba(55, 14, 98, 0.4) 0%, rgba(182, 0, 125, 0.2) 100%)' }}
      >
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          {ad.ad_image && (
            <img 
              src={`http://localhost:8000/${ad.ad_image}`} 
              alt="Ad" 
              className="w-16 h-16 object-cover rounded-xl border border-white/10"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div>
            <h4 className="text-lg font-bold text-[#F5C300] mb-1">{ad.headline}</h4>
            {ad.tagline && <p className="text-sm text-gray-300">{ad.tagline}</p>}
          </div>
        </div>
        
        {ad.website_link && (
          <a 
            href={ad.website_link.startsWith('http') ? ad.website_link : `https://${ad.website_link}`} 
            target="_blank" 
            rel="noreferrer" 
          >
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-[#F5C300] hover:bg-[#FFD700] text-[#370E62] font-bold py-2 px-6 rounded-xl transition-colors"
            >
              Learn More
            </motion.button>
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AdBanner;
