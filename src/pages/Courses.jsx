import React, { useState, useEffect } from 'react';
import { glassmorphicStyles } from '../theme';
import { Book, Clock, Users, Loader2, AlertCircle, ArrowLeft, Download, Share2 } from 'lucide-react';

const fallbackImages = [
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1559688402-9a008c26de46?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=800&auto=format&fit=crop&q=60'
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/courses/get-all');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#F5C300] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-red-400 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    const courseIndex = courses.findIndex(c => c.course_id === selectedCourse.course_id);
    const imgUrl = selectedCourse.course_photo 
      ? (selectedCourse.course_photo.startsWith('http') ? selectedCourse.course_photo : `http://localhost:8000/${selectedCourse.course_photo.replace(/\\/g, '/')}`)
      : fallbackImages[courseIndex % fallbackImages.length];

    return (
      <div className={`p-8 rounded-2xl bg-[#370E62]/80 backdrop-blur-xl border border-white/10 flex flex-col shadow-2xl`}>
        <button 
          onClick={() => setSelectedCourse(null)} 
          className="flex items-center gap-2 text-[#F5C300] hover:text-white transition-colors mb-6 font-medium w-fit"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </button>

        <div className="w-full h-[300px] rounded-2xl overflow-hidden mb-8 shadow-inner">
          <img src={imgUrl} alt={selectedCourse.course_name} className="w-full h-full object-cover" />
        </div>

        <h1 className="text-3xl font-bold text-[#F5C300] mb-1">{selectedCourse.course_name}</h1>
        <p className="text-gray-300 text-sm mb-8">Code: {selectedCourse.course_code}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Description</h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {selectedCourse.course_description || "No description available."}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Requirements</h2>
            <ul className="text-gray-300 text-sm space-y-2">
              {selectedCourse.weight_requirements && <li><span className="font-semibold text-white">Weight:</span> {selectedCourse.weight_requirements}</li>}
              {selectedCourse.height_requirements && <li><span className="font-semibold text-white">Height:</span> {selectedCourse.height_requirements}</li>}
              {selectedCourse.vision_standards && <li><span className="font-semibold text-white">Vision:</span> {selectedCourse.vision_standards}</li>}
              {selectedCourse.min_educational_qualification && <li><span className="font-semibold text-white">Education:</span> {selectedCourse.min_educational_qualification}</li>}
              {selectedCourse.age_criteria && <li><span className="font-semibold text-white">Age:</span> {selectedCourse.age_criteria}</li>}
              {!selectedCourse.weight_requirements && !selectedCourse.height_requirements && !selectedCourse.min_educational_qualification && <p>No specific requirements listed.</p>}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Additional Details</h2>
            <ul className="text-gray-300 text-sm space-y-3">
              <li><span className="font-semibold text-white">Fees:</span> {
                (selectedCourse.general_data?.course_fees ?? selectedCourse.executive_data?.course_fees) !== undefined &&
                (selectedCourse.general_data?.course_fees ?? selectedCourse.executive_data?.course_fees) !== null
                  ? `₹${selectedCourse.general_data?.course_fees ?? selectedCourse.executive_data?.course_fees}`
                  : 'N/A'
              }</li>
              <li><span className="font-semibold text-white">Internship Included:</span> {selectedCourse.internship_included ? 'Yes' : 'No'}</li>
              <li><span className="font-semibold text-white">Installment Available:</span> {selectedCourse.installment_available ? 'Yes' : 'No'}</li>
              {selectedCourse.installment_policy && <li><span className="font-semibold text-white">Installment Policy:</span> {selectedCourse.installment_policy}</li>}
              {selectedCourse.general_data?.placement_type && <li><span className="font-semibold text-white">Placement Assistance:</span> {selectedCourse.general_data.placement_type}</li>}
              {selectedCourse.general_data?.placement_rate > 0 && <li><span className="font-semibold text-white">Placement Rate:</span> {selectedCourse.general_data.placement_rate}%</li>}
              {selectedCourse.general_data?.job_roles_offered && <li><span className="font-semibold text-white">Job Roles:</span> {selectedCourse.general_data.job_roles_offered}</li>}
            </ul>
          </div>
        </div>

        <div className="flex gap-4 mt-auto pt-6 border-t border-white/10">
          <button className="px-6 py-3 rounded-lg bg-[#F5C300] text-[#370E62] font-bold hover:bg-[#FFD700] transition-colors">
            Enroll Student
          </button>
          <button 
            onClick={() => {
              alert(`Downloading brochure for ${selectedCourse.course_name}...`);
              // In production, this would trigger a file download from backend
            }}
            className="px-6 py-3 rounded-lg bg-white flex items-center gap-2 text-[#370E62] font-bold hover:bg-gray-100 transition-colors"
          >
            <Download size={18} />
            Download Brochure
          </button>
          <button 
            onClick={() => {
              const link = `https://vwings24x7.com/courses/${selectedCourse.course_id || selectedCourse.course_code}`;
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(link)
                  .then(() => alert(`Course link copied to clipboard!\n${link}`))
                  .catch(err => alert(`Failed to copy link: ${err}`));
              } else {
                alert(`Share this link:\n${link}`);
              }
            }}
            className="px-6 py-3 rounded-lg border border-white/20 text-white flex items-center gap-2 font-bold hover:bg-white/10 transition-colors"
          >
            <Share2 size={18} />
            Share Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Course Catalog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, i) => {
          const imgUrl = course.course_photo 
            ? (course.course_photo.startsWith('http') ? course.course_photo : `http://localhost:8000/${course.course_photo.replace(/\\/g, '/')}`)
            : fallbackImages[i % fallbackImages.length];

          const duration = course.general_data?.duration || 'Variable';
          const backendFee = course.general_data?.course_fees ?? course.executive_data?.course_fees;
          const fee = (backendFee !== undefined && backendFee !== null) ? `₹${backendFee}` : 'Contact for details';

          return (
            <div key={course.course_id || i} className={`rounded-2xl ${glassmorphicStyles.card} flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
              <div className="h-48 w-full relative">
                <img src={imgUrl} alt={course.course_name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5C300] to-[#FFD700] flex items-center justify-center text-[#370E62] shadow-lg">
                  <Book size={20} />
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{course.course_name}</h3>
                
                <div className="space-y-2 mb-6 mt-2 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#F5C300]" />
                    <span>Duration: {duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#F5C300]" />
                    <span>Active Students: {Math.floor(Math.random() * 100) + 20}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <span className="text-gray-400 block text-xs">Course Fee</span>
                    <span className="text-lg font-bold text-white">{fee}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F5C300] to-[#FFD700] text-[#370E62] font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
