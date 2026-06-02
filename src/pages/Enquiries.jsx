import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { glassmorphicStyles } from '../theme';
import { Search, Plus, Filter, Loader2, AlertCircle, X } from 'lucide-react';

const Enquiries = () => {
  const toast = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    student_name: '',
    student_phn_no: '',
    course_id: '',
    counsellor_id: '', // Will be set in useEffect
    admission_code: '', // Will be set after fetching
  });
  const [counsellorData, setCounsellorData] = useState(null);
  const [admissionCodes, setAdmissionCodes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('counsellorData');
    let parsedData = null;
    if (storedData) {
      try {
        parsedData = JSON.parse(storedData);
        setCounsellorData(parsedData);
        setFormData(prev => ({...prev, counsellor_id: parsedData.counsellor_id}));
      } catch (err) {
        console.error("Failed to parse counsellor data:", err);
      }
    }
    
    fetchEnquiries(parsedData?.counsellor_id);
    fetchCourses();
    fetchAdmissionCodes(parsedData?.counsellor_id);
  }, []);

  const fetchAdmissionCodes = async (counsellorId) => {
    try {
      const response = await fetch('http://localhost:8000/api/admission-codes/get-all');
      if (response.ok) {
        const data = await response.json();
        const filteredCodes = counsellorId ? data.filter(c => c.counsellor_id === counsellorId) : [];
        setAdmissionCodes(filteredCodes);
        if (filteredCodes.length > 0) {
          setFormData(prev => ({ ...prev, admission_code: filteredCodes[0].admission_code }));
        } else {
          setFormData(prev => ({ ...prev, admission_code: '' }));
        }
      }
    } catch (err) {
      console.error("Failed to load admission codes:", err);
    }
  };

  const fetchEnquiries = async (counsellorId) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/admission-enquiries/get-all');
      if (!response.ok) throw new Error('Failed to fetch enquiries');
      const data = await response.json();
      
      // Filter by logged-in counsellor
      const filteredData = counsellorId ? data.filter(enq => enq.counsellor_id === counsellorId) : [];
      setEnquiries(filteredData);
      setError(null);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Failed to load student enquiries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/courses/get-all');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (err) {
      console.error("Failed to load courses for dropdown:", err);
    }
  };

  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:8000/api/admission-enquiries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to create enquiry');
      }
      
      await fetchEnquiries(counsellorData?.counsellor_id); // Refresh the list
      setShowModal(false);
      setFormData({ ...formData, student_name: '', student_phn_no: '', course_id: '' });
      toast.success("Enquiry created successfully!");
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admission-enquiries/update-status/${enquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      await fetchEnquiries(counsellorData?.counsellor_id);
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending' || s === 'new') return 'bg-blue-500/20 text-blue-300';
    if (s === 'contacted' || s === 'in progress') return 'bg-yellow-500/20 text-yellow-300';
    if (s === 'converted') return 'bg-green-500/20 text-green-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Student Enquiries</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#F5C300] to-[#FFD700] text-[#370E62] font-bold py-2 px-4 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} /> New Enquiry
        </button>
      </div>

      <div className={`p-6 rounded-2xl ${glassmorphicStyles.card}`}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search enquiries..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white py-2 px-4 rounded-xl hover:bg-white/10 transition-colors">
            <Filter size={20} /> Filter
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#F5C300] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p>{error}</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Student Name</th>
                  <th className="pb-3 font-medium">Interested Course</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq.enquiry_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 text-sm">{enq.enquiry_id}</td>
                    <td className="py-4 font-medium">{enq.student_name}</td>
                    <td className="py-4 text-gray-300">{enq.course_name || enq.course_id}</td>
                    <td className="py-4 text-gray-300">
                      {new Date(enq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(enq.status)}`}>
                        {enq.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4">
                      <select 
                        value={enq.status || 'pending'} 
                        onChange={(e) => handleStatusChange(enq.enquiry_id, e.target.value)}
                        className="bg-white/5 border border-white/10 text-[#F5C300] rounded-lg px-2 py-1 focus:outline-none focus:border-[#F5C300] transition-colors text-sm font-medium cursor-pointer"
                      >
                        <option value="pending" className="bg-[#370E62] text-white">Pending</option>
                        <option value="contacted" className="bg-[#370E62] text-white">Contacted</option>
                        <option value="in progress" className="bg-[#370E62] text-white">In Progress</option>
                        <option value="converted" className="bg-[#370E62] text-white">Converted</option>
                        <option value="cancelled" className="bg-[#370E62] text-white">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl ${glassmorphicStyles.dark} border border-white/20 shadow-2xl relative`}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-[#F5C300] mb-6">New Enquiry</h2>
            
            <form onSubmit={handleCreateEnquiry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Student Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.student_phn_no}
                  onChange={(e) => setFormData({...formData, student_phn_no: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Interested Course</label>
                <select 
                  required
                  value={formData.course_id}
                  onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                  className="w-full bg-[#370E62] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300]"
                >
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Counsellor ID</label>
                  <input 
                    type="text" 
                    required
                    disabled
                    value={formData.counsellor_id}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Admission Code</label>
                  {admissionCodes.length > 0 ? (
                    <select 
                      required
                      value={formData.admission_code}
                      onChange={(e) => setFormData({...formData, admission_code: e.target.value})}
                      className="w-full bg-[#370E62] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300]"
                    >
                      {admissionCodes.map(code => (
                        <option key={code.admission_code} value={code.admission_code}>{code.admission_code}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      required
                      value={formData.admission_code}
                      onChange={(e) => setFormData({...formData, admission_code: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300]"
                      placeholder="Enter code"
                    />
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#F5C300] text-[#370E62] font-bold py-3 rounded-xl hover:bg-[#FFD700] transition-colors mt-4 flex justify-center items-center"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Enquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;

