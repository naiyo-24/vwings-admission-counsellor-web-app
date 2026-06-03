import React, { useState, useEffect } from 'react';
import { glassmorphicStyles } from '../theme';
import { CheckCircle, Clock, Loader2, AlertCircle, X } from 'lucide-react';

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/students/get-all');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        
        const storedData = localStorage.getItem('counsellorData');
        let counsellorId = null;
        if (storedData) {
          try {
            counsellorId = JSON.parse(storedData).counsellor_id;
          } catch (e) {
            console.error("Failed to parse counsellor data");
          }
        }
        
        const filteredData = counsellorId ? data.filter(adm => adm.counsellor_id === counsellorId) : [];
        setAdmissions(filteredData);
        setError(null);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load admissions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A2134]">Admissions Processing</h1>
      
      <div className={`p-6 rounded-2xl ${glassmorphicStyles.card}`}>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#C0BEC5] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p>{error}</p>
          </div>
        ) : admissions.length === 0 ? (
          <div className="text-center py-12 text-[#373F52]">
            <p>No enrolled students found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {admissions.map((adm) => (
              <div key={adm.student_id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-xl bg-white/40 border border-[#C0BEC5]/30 hover:bg-white/60 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-[#1A2134]">{adm.full_name || adm.username}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/60 text-[#373F52]">{adm.student_id}</span>
                  </div>
                  <p className="text-[#373F52]">{adm.course_name || adm.course_availing || 'Course Pending'}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#373F52]">Payment:</span>
                    <span className={`text-sm font-medium text-green-400`}>
                      Completed
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" />
                    <span className="text-[#1A2134] font-medium">Enrolled</span>
                  </div>
                  
                  <div className="w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
                    <button 
                      onClick={() => setSelectedStudent(adm)}
                      className="bg-gradient-to-r from-[#7B0771] to-[#9E161B] text-white px-6 py-2 sm:px-4 sm:py-1.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-md w-full sm:w-auto"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl bg-white border border-[#C0BEC5]/30 shadow-2xl relative overflow-y-auto max-h-[90vh]`}>
            <button 
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-[#373F52] hover:text-[#7B0771] transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-[#1A2134] mb-6 border-b border-[#C0BEC5]/30 pb-4">
              Student Review
            </h2>
            
            <div className="space-y-4 text-[#373F52]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold text-[#1A2134]">{selectedStudent.full_name || selectedStudent.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-semibold text-[#1A2134]">{selectedStudent.student_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-[#1A2134]">{selectedStudent.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone / Username</p>
                  <p className="font-semibold text-[#1A2134]">{selectedStudent.username || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-[#1A2134]">{selectedStudent.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guardian Name</p>
                  <p className="font-semibold text-[#1A2134]">{selectedStudent.guardian_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guardian Phone</p>
                  <p className="font-semibold text-[#1A2134]">{selectedStudent.guardian_mobile_no || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Course Availing</p>
                  <p className="font-semibold text-[#7B0771] text-lg">{selectedStudent.course_name || selectedStudent.course_availing}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedStudent(null)}
                className="w-full bg-white border border-[#C0BEC5]/50 text-[#1A2134] font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors mt-6 flex justify-center items-center shadow-sm"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admissions;
