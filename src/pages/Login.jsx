import React, { useState } from 'react';
import { glassmorphicStyles } from '../theme';
import { LogIn, Loader } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
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
          // Optionally you can pass 'data' to onLogin(data) if you have an AuthContext to store user details
          onLogin(data);
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Invalid email or password');
        }
      } catch (err) {
        setError('Network error. Please make sure the server is running.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#370E62] to-[#B6007D] flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-8 rounded-3xl ${glassmorphicStyles.dark}`}>
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/V-Wings_Logo_nobg.png" alt="VWings24x7 Logo" className="w-20 h-20 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-[#F5C300]">VWings24x7</h1>
          <p className="text-gray-300 text-sm mt-1">Admission Counsellor Portal</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg text-sm text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#370E62]/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F5C300] focus:ring-1 focus:ring-[#F5C300] transition-colors"
              placeholder="counsellor@vwings.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#370E62]/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F5C300] focus:ring-1 focus:ring-[#F5C300] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-[#F5C300] to-[#FFD700] hover:from-[#FFD700] hover:to-[#F5C300] text-[#370E62] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
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
