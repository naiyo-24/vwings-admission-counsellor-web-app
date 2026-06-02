import React, { useState, useEffect } from 'react';
import { glassmorphicStyles } from '../theme';
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';

const CommissionSlips = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayouts = async () => {
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
        
        if (!counsellorId) return;

        const response = await fetch(`http://localhost:8000/api/commissions/payouts?counsellor_id=${counsellorId}`);
        if (!response.ok) throw new Error('Failed to fetch payout slips');
        const data = await response.json();
        
        setCommissions(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching payouts:", err);
        setError("Failed to load payout slips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  const getMonthYearString = (month, year) => {
    try {
      const date = new Date(year, month - 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } catch {
      return `${month}/${year}`;
    }
  };

  const handleDownload = (payoutId) => {
    window.open(`http://localhost:8000/api/commissions/payouts/download/${payoutId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Payout Slips</h1>
      
      <div className={`p-6 rounded-2xl ${glassmorphicStyles.card}`}>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#F5C300] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p>{error}</p>
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No commission slips have been generated for you yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commissions.map((slip) => (
              <div key={slip.id} className="flex flex-col md:flex-row justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                  <div className="p-3 bg-[#370E62]/50 rounded-lg text-[#F5C300]">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Payout: {slip.payout_no}</h3>
                    <p className="text-sm text-gray-400">Date: {new Date(slip.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400">Reference: {slip.reference_no || 'N/A'}</p>
                    <p className="text-sm text-[#F5C300] font-bold">Amount: ₹{slip.amount}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full md:w-auto gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-green-400 font-medium">{slip.status}</p>
                  </div>
                  <button 
                    onClick={() => handleDownload(slip.id)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/20"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionSlips;
