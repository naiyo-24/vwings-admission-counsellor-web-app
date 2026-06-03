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
        setFormData(prev => ({ ...prev, counsellor_id: parsedData.counsellor_id }));
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
    if (s === 'pending' || s === 'new') return 'bg-blue-100 text-blue-700';
    if (s === 'contacted' || s === 'in progress') return 'bg-yellow-100 text-yellow-700';
    if (s === 'converted') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1A2134]">Student Enquiries</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#7B0771] to-[#9E161B] text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus size={20} /> New Enquiry
        </button>
      </div>

      <div className={`p-6 rounded-2xl ${glassmorphicStyles.card}`}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#373F52]" size={20} />
            <input
              type="text"
              placeholder="Search enquiries..."
              className="w-full bg-white/40 border border-[#C0BEC5]/30 rounded-xl pl-10 pr-4 py-2 text-[#1A2134] focus:outline-none focus:border-[#C0BEC5] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-white/40 border border-[#C0BEC5]/30 text-[#1A2134] py-2 px-4 rounded-xl hover:bg-white/60 transition-colors">
            <Filter size={20} /> Filter
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#C0BEC5] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p>{error}</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12 text-[#373F52]">
            <p>No enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-[#1A2134] whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="border-b border-[#C0BEC5]/30 text-[#373F52]">
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
                  <tr key={enq.enquiry_id} className="border-b border-white/5 hover:bg-white/40 transition-colors">
                    <td className="py-4 text-sm">{enq.enquiry_id}</td>
                    <td className="py-4 font-medium">{enq.student_name}</td>
                    <td className="py-4 text-[#373F52]">{enq.course_name || enq.course_id}</td>
                    <td className="py-4 text-[#373F52]">
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
                        className="bg-white/60 border border-[#C0BEC5]/50 text-[#1A2134] rounded-lg px-2 py-1 focus:outline-none focus:border-[#7B0771] transition-colors text-sm font-medium cursor-pointer shadow-sm"
                      >
                        <option value="pending" className="bg-white text-[#1A2134]">Pending</option>
                        <option value="contacted" className="bg-white text-[#1A2134]">Contacted</option>
                        <option value="in progress" className="bg-white text-[#1A2134]">In Progress</option>
                        <option value="converted" className="bg-white text-[#1A2134]">Converted</option>
                        <option value="cancelled" className="bg-white text-[#1A2134]">Cancelled</option>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl bg-white border border-[#C0BEC5]/30 shadow-2xl relative`}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#373F52] hover:text-[#7B0771] transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-[#1A2134] mb-6">New Enquiry</h2>

            <form onSubmit={handleCreateEnquiry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#373F52] mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  className="w-full bg-white/40 border border-[#C0BEC5]/30 rounded-xl px-4 py-2 text-[#1A2134] focus:outline-none focus:border-[#C0BEC5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#373F52] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.student_phn_no}
                  onChange={(e) => setFormData({ ...formData, student_phn_no: e.target.value })}
                  className="w-full bg-white/40 border border-[#C0BEC5]/30 rounded-xl px-4 py-2 text-[#1A2134] focus:outline-none focus:border-[#C0BEC5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#373F52] mb-1">Interested Course</label>
                <select
                  required
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full bg-white border border-[#C0BEC5]/50 rounded-xl px-4 py-2 text-[#1A2134] focus:outline-none focus:border-[#7B0771]"
                >
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#373F52] mb-1">Counsellor ID</label>
                  <input
                    type="text"
                    required
                    disabled
                    value={formData.counsellor_id}
                    className="w-full bg-gray-100 border border-[#C0BEC5]/30 rounded-xl px-4 py-2 text-[#373F52] cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#373F52] mb-1">Admission Code</label>
                  {admissionCodes.length > 0 ? (
                    <select
                      required
                      value={formData.admission_code}
                      onChange={(e) => setFormData({ ...formData, admission_code: e.target.value })}
                      className="w-full bg-white border border-[#C0BEC5]/50 rounded-xl px-4 py-2 text-[#1A2134] focus:outline-none focus:border-[#7B0771]"
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
                      onChange={(e) => setFormData({ ...formData, admission_code: e.target.value })}
                      className="w-full bg-white/40 border border-[#C0BEC5]/30 rounded-xl px-4 py-2 text-[#1A2134] focus:outline-none focus:border-[#C0BEC5]"
                      placeholder="Enter code"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#7B0771] to-[#9E161B] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mt-4 flex justify-center items-center shadow-md disabled:opacity-50"
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

