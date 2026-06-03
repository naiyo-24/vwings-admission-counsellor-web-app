import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { glassmorphicStyles } from '../theme';
import { Book, Clock, Users, Loader2, AlertCircle, ArrowLeft, Download, Share2 } from 'lucide-react';

const fallbackImages = [
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1559688402-9a008c26de46?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=800&auto=format&fit=crop&q=60'
];

const Courses = () => {
  const toast = useToast();
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
        <Loader2 className="w-8 h-8 text-[#C0BEC5] animate-spin" />
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
      <div className={`p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#C0BEC5]/30 flex flex-col shadow-2xl`}>
        <button 
          onClick={() => setSelectedCourse(null)} 
          className="flex items-center gap-2 text-[#373F52] hover:text-[#7B0771] transition-colors mb-6 font-medium w-fit"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </button>

        <div className="w-full h-[300px] rounded-2xl overflow-hidden mb-8 shadow-inner">
          <img src={imgUrl} alt={selectedCourse.course_name} className="w-full h-full object-cover" />
        </div>

        <h1 className="text-3xl font-bold text-[#1A2134] mb-1">{selectedCourse.course_name}</h1>
        <p className="text-[#373F52] text-sm mb-8 font-medium">Code: {selectedCourse.course_code}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-bold text-[#1A2134] mb-4 border-b border-[#C0BEC5]/30 pb-2">Description</h2>
            <p className="text-[#373F52] text-sm leading-relaxed whitespace-pre-wrap">
              {selectedCourse.course_description || "No description available."}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-[#1A2134] mb-4 border-b border-[#C0BEC5]/30 pb-2">Requirements</h2>
            <ul className="text-[#373F52] text-sm space-y-2">
              {selectedCourse.weight_requirements && <li><span className="font-semibold text-[#1A2134]">Weight:</span> {selectedCourse.weight_requirements}</li>}
              {selectedCourse.height_requirements && <li><span className="font-semibold text-[#1A2134]">Height:</span> {selectedCourse.height_requirements}</li>}
              {selectedCourse.vision_standards && <li><span className="font-semibold text-[#1A2134]">Vision:</span> {selectedCourse.vision_standards}</li>}
              {selectedCourse.min_educational_qualification && <li><span className="font-semibold text-[#1A2134]">Education:</span> {selectedCourse.min_educational_qualification}</li>}
              {selectedCourse.age_criteria && <li><span className="font-semibold text-[#1A2134]">Age:</span> {selectedCourse.age_criteria}</li>}
              {!selectedCourse.weight_requirements && !selectedCourse.height_requirements && !selectedCourse.min_educational_qualification && <p>No specific requirements listed.</p>}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1A2134] mb-4 border-b border-[#C0BEC5]/30 pb-2">Additional Details</h2>
            <ul className="text-[#373F52] text-sm space-y-3">
              <li><span className="font-semibold text-[#1A2134]">Fees:</span> {
                (selectedCourse.general_data?.course_fees ?? selectedCourse.executive_data?.course_fees) !== undefined &&
                (selectedCourse.general_data?.course_fees ?? selectedCourse.executive_data?.course_fees) !== null
                  ? `₹${selectedCourse.general_data?.course_fees ?? selectedCourse.executive_data?.course_fees}`
                  : 'N/A'
              }</li>
              <li><span className="font-semibold text-[#1A2134]">Internship Included:</span> {selectedCourse.internship_included ? 'Yes' : 'No'}</li>
              <li><span className="font-semibold text-[#1A2134]">Installment Available:</span> {selectedCourse.installment_available ? 'Yes' : 'No'}</li>
              {selectedCourse.installment_policy && <li><span className="font-semibold text-[#1A2134]">Installment Policy:</span> {selectedCourse.installment_policy}</li>}
              {selectedCourse.general_data?.placement_type && <li><span className="font-semibold text-[#1A2134]">Placement Assistance:</span> {selectedCourse.general_data.placement_type}</li>}
              {selectedCourse.general_data?.placement_rate > 0 && <li><span className="font-semibold text-[#1A2134]">Placement Rate:</span> {selectedCourse.general_data.placement_rate}%</li>}
              {selectedCourse.general_data?.job_roles_offered && <li><span className="font-semibold text-[#1A2134]">Job Roles:</span> {selectedCourse.general_data.job_roles_offered}</li>}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mt-auto pt-6 border-t border-[#C0BEC5]/30">
          <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#7B0771] to-[#9E161B] text-white shadow-lg font-bold hover:opacity-90 transition-opacity flex justify-center items-center">
            Enroll Student
          </button>
          <button 
            onClick={() => {
              toast.error(`Downloading brochure for ${selectedCourse.course_name}...`);
              // In production, this would trigger a file download from backend
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white border border-[#C0BEC5]/50 flex items-center justify-center gap-2 text-[#1A2134] font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            Download Brochure
          </button>
          <button 
            onClick={() => {
              const link = `https://vwings24x7.com/courses/${selectedCourse.course_id || selectedCourse.course_code}`;
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(link)
                  .then(() => toast.success(`Course link copied to clipboard!\n${link}`))
                  .catch(err => toast.error(`Failed to copy link: ${err}`));
              } else {
                toast.error(`Share this link:\n${link}`);
              }
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#C0BEC5]/50 text-[#1A2134] flex items-center justify-center gap-2 font-bold hover:bg-white/60 transition-colors shadow-sm"
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
      <h1 className="text-2xl font-bold text-[#1A2134]">Course Catalog</h1>
      
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
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B0771] to-[#9E161B] flex items-center justify-center text-white shadow-lg">
                  <Book size={20} />
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-[#1A2134] mb-2">{course.course_name}</h3>
                
                <div className="space-y-2 mb-6 mt-2 text-[#373F52] text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#C0BEC5]" />
                    <span>Duration: {duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#C0BEC5]" />
                    <span>Active Students: {Math.floor(Math.random() * 100) + 20}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-[#C0BEC5]/30 flex justify-between items-center">
                  <div>
                    <span className="text-[#373F52] block text-xs">Course Fee</span>
                    <span className="text-lg font-bold text-[#1A2134]">{fee}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7B0771] to-[#9E161B] text-white shadow-lg font-semibold text-sm hover:opacity-90 transition-opacity"
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

