import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader, X, BookOpen, User, Briefcase, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleResultClick = (item, type) => {
    setIsOpen(false);
    setQuery('');
    if (type === 'courses') {
      navigate(`/courses/${item.id}`);
    }
    // Expand to other user types if needed in the future
  };

  const hasResults = results && (
    results.courses?.length > 0 ||
    results.students?.length > 0 ||
    results.teachers?.length > 0 ||
    results.counsellors?.length > 0
  );

  const renderSection = (title, items, icon, type) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-3">
        <h4 className="m-0 mb-2 ml-3 text-xs text-[#717A8D] uppercase tracking-wide flex items-center gap-1.5">
          {icon} {title}
        </h4>
        <div className="flex flex-col">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => handleResultClick(item, type)}
              className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-[#1A2134] hover:bg-black/5"
            >
              {item.photo ? (
                <img src={`${API_BASE_URL}/${item.photo.replace(/\\/g, '/')}`} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-[#717A8D]">
                  {icon}
                </div>
              )}
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="font-semibold text-sm text-[#1A2134] whitespace-nowrap text-ellipsis overflow-hidden">
                  {item.name || 'Unknown User'}
                </span>
                <span className="text-xs text-[#373F52] whitespace-nowrap text-ellipsis overflow-hidden">
                  {item.code || item.email || item.phone_no || 'No Details'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center w-full">
        <Search size={18} className="absolute left-3 text-[#717A8D]" />
        <input
          type="text"
          placeholder="Search courses, users..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-black/5 border border-[#E2E8F0] py-2.5 pl-[38px] pr-9 rounded-xl text-[#1A2134] text-sm outline-none transition-all hover:bg-black/10 focus:bg-black/10 focus:border-[#7B0771]"
        />
        {isLoading && (
          <Loader size={16} className="absolute right-3 animate-spin text-[#717A8D]" />
        )}
        {query && !isLoading && (
          <X 
            size={16} 
            className="absolute right-3 text-[#717A8D] cursor-pointer" 
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }} 
          />
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+8px)] left-0 w-full md:w-[350px] right-0 md:right-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-[9999] max-h-[400px] overflow-y-auto p-3 backdrop-blur-xl bg-white/95"
          >
            {results ? (
              hasResults ? (
                <>
                  {renderSection('Courses', results.courses, <BookOpen size={14} />, 'courses')}
                  {renderSection('Students', results.students, <User size={14} />, 'students')}
                  {renderSection('Teachers', results.teachers, <Briefcase size={14} />, 'teachers')}
                  {renderSection('Counsellors', results.counsellors, <HeartHandshake size={14} />, 'counsellors')}
                </>
              ) : (
                <div className="p-6 text-center text-[#717A8D] text-sm">
                  No results found for "{query}"
                </div>
              )
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
