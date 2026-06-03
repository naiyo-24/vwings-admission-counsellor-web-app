import React, { useState } from 'react';
import { glassmorphicStyles } from '../theme';
import { LogIn, Loader } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const Login = ({ onLogin }) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/api/counsellors/login', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          toast.success('Login successful! Welcome to the Counsellor Portal.');
          onLogin(data);
        } else {
          const errorData = await response.json();
          toast.error(errorData.detail || 'Invalid email or password');
        }
      } catch (err) {
        toast.error('Network error. Please make sure the server is running.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#C0BEC5]/30">
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/V-Wings_Logo_nobg.png" alt="VWings24x7 Logo" className="w-20 h-20 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-[#1A2134]">VWings24x7</h1>
          <p className="text-[#373F52] text-sm mt-1">Admission Counsellor Portal</p>
        </div>



        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#373F52] mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-[#C0BEC5]/50 rounded-xl px-4 py-3 text-[#1A2134] placeholder-gray-400 focus:outline-none focus:border-[#7B0771] focus:ring-1 focus:ring-[#7B0771] transition-colors"
              placeholder="counsellor@vwings.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#373F52] mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-[#C0BEC5]/50 rounded-xl px-4 py-3 text-[#1A2134] placeholder-gray-400 focus:outline-none focus:border-[#7B0771] focus:ring-1 focus:ring-[#7B0771] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-[#7B0771] to-[#9E161B] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:opacity-90 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In to Portal'}
            {isLoading ? <Loader size={20} className="animate-spin" /> : <LogIn size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
