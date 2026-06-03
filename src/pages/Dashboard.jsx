import React, { useState, useEffect } from 'react';
import { glassmorphicStyles } from '../theme';
import { Users, UserCheck, Receipt, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WelcomeModalNew from '../components/WelcomeModalNew';

const Dashboard = () => {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [data, setData] = useState({
    enquiriesCount: 0,
    admissionsCount: 0,
    commissionsCount: 0,
    recentEnquiries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsWelcomeModalOpen(true);
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }

    const fetchDashboardData = async () => {
      try {
        const storedData = localStorage.getItem('counsellorData');
        let counsellorId = null;
        if (storedData) {
          try {
            counsellorId = JSON.parse(storedData).counsellor_id;
          } catch (e) {
            console.error("Failed to parse counsellor data");
          }
        }

        const [enqRes, admRes, commRes] = await Promise.all([
          fetch('http://localhost:8000/api/admission-enquiries/get-all'),
          fetch('http://localhost:8000/api/students/get-all'),
          fetch(`http://localhost:8000/api/commissions/payouts${counsellorId ? `?counsellor_id=${counsellorId}` : ''}`)
        ]);

        if (!enqRes.ok || !admRes.ok || !commRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const enquiries = await enqRes.json();
        const admissions = await admRes.json();
        const commissions = await commRes.json();
        
        const filteredEnquiries = counsellorId ? enquiries.filter(e => e.counsellor_id === counsellorId) : [];
        const filteredAdmissions = counsellorId ? admissions.filter(a => a.counsellor_id === counsellorId) : [];
        // Payouts are already filtered by the API if counsellorId is provided, but we can double check
        const filteredCommissions = counsellorId ? commissions.filter(c => c.counsellor_id === counsellorId) : [];

        // Sort enquiries to get recent ones
        const recent = [...filteredEnquiries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);

        setData({
          enquiriesCount: filteredEnquiries.length,
          admissionsCount: filteredAdmissions.length,
          commissionsCount: filteredCommissions.length,
          recentEnquiries: recent
        });
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Total Enquiries', value: data.enquiriesCount, icon: Users, color: 'text-blue-400', path: '/enquiries' },
    { label: 'New Admissions', value: data.admissionsCount, icon: UserCheck, color: 'text-green-400', path: '/admissions' },
    { label: 'Commission Slips', value: data.commissionsCount, icon: Receipt, color: 'text-yellow-400', path: '/commissions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-[#C0BEC5] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-400">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  const getTimeAgo = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="space-y-8">
      <WelcomeModalNew isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl ${glassmorphicStyles.card} flex flex-col`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/40 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-[#373F52] font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-[#1A2134] mt-1 mb-4">{stat.value}</p>
            <Link to={stat.path} className="flex items-center text-sm text-[#7B0771] hover:text-[#9E161B] transition-colors mt-auto w-fit">
              View Details <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-2xl ${glassmorphicStyles.card}`}>
        <h2 className="text-xl font-bold text-[#1A2134] mb-6">Recent Activity</h2>
        {data.recentEnquiries.length === 0 ? (
          <p className="text-[#373F52]">No recent activity found.</p>
        ) : (
          <div className="space-y-4">
            {data.recentEnquiries.map((enq) => (
              <div key={enq.enquiry_id} className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-[#C0BEC5]/30">
                <div className="w-2 h-2 rounded-full bg-[#7B0771]"></div>
                <div>
                  <p className="text-[#1A2134] font-medium">New Enquiry from {enq.student_name}</p>
                  <p className="text-[#373F52] text-sm">
                    Interested in {enq.course_name || enq.course_id} • {getTimeAgo(enq.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
