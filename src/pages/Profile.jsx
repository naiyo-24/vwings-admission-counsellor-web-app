import React, { useState, useEffect } from 'react';
import { glassmorphicStyles } from '../theme';
import { UploadCloud, Save, User, Loader2, AlertCircle, Edit2, X, CheckCircle } from 'lucide-react';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const loadProfile = () => {
      const storedData = localStorage.getItem('counsellorData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setProfile(parsedData);
          setFormData(parsedData);
          setError(null);
        } catch (err) {
          console.error("Error parsing profile data:", err);
          setError("Failed to load profile. Please try again later.");
        }
      } else {
        setError("No profile found.");
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const formDataToSend = new FormData();
      
      const fieldsToUpdate = [
        'full_name', 'phone_no', 'alternative_phone_no', 'address', 
        'qualification', 'experience', 'bank_account_name', 
        'bank_account_no', 'ifsc_code', 'upi_id'
      ];

      fieldsToUpdate.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== null) {
          formDataToSend.append(field, formData[field]);
        }
      });

      if (file) {
        formDataToSend.append('profile_photo', file);
      }

      const response = await fetch(`http://localhost:8000/api/counsellors/put-by/${profile.counsellor_id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setFormData(updatedData);
      localStorage.setItem('counsellorData', JSON.stringify(updatedData));
      setIsEditing(false);
      setFile(null); // Reset file
      setSuccessMsg("Profile updated successfully!");
      
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:8000/${path}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-[#F5C300] animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-400">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg">{error || "No profile found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profile Management</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors border border-white/20 flex items-center gap-2"
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        ) : (
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData(profile); // Revert changes
              setFile(null);
            }}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl transition-colors border border-red-500/20 flex items-center gap-2"
          >
            <X size={18} /> Cancel
          </button>
        )}
      </div>

      {successMsg && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle size={20} />
          <p>{successMsg}</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}
      
      <div className={`p-8 rounded-2xl ${glassmorphicStyles.card}`}>
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="flex flex-col items-center space-y-4 md:w-1/3 border-r border-white/10 pr-0 md:pr-8">
            <div className="w-32 h-32 rounded-full bg-[#370E62] border-4 border-[#F5C300] flex items-center justify-center overflow-hidden">
              {profile.profile_photo ? (
                <img src={getProfileImageUrl(profile.profile_photo)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-[#F5C300]" />
              )}
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/20 text-sm w-full">
              Change Avatar
            </button>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Full Name</label>
                <input 
                  type="text"
                  name="full_name"
                  value={formData.full_name || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email || ''} 
                  disabled
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-gray-400 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone_no"
                  value={formData.phone_no || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Alternative Phone</label>
                <input 
                  type="tel" 
                  name="alternative_phone_no"
                  value={formData.alternative_phone_no || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-300">Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Qualification</label>
                <input 
                  type="text" 
                  name="qualification"
                  value={formData.qualification || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Experience</label>
                <input 
                  type="text" 
                  name="experience"
                  value={formData.experience || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Bank Account Name</label>
                <input 
                  type="text" 
                  name="bank_account_name"
                  value={formData.bank_account_name || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Bank Account No.</label>
                <input 
                  type="text" 
                  name="bank_account_no"
                  value={formData.bank_account_no || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">IFSC Code</label>
                <input 
                  type="text" 
                  name="ifsc_code"
                  value={formData.ifsc_code || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">UPI ID</label>
                <input 
                  type="text" 
                  name="upi_id"
                  value={formData.upi_id || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F5C300] transition-colors ${
                    isEditing ? 'bg-[#370E62]/60 border-white/40' : 'bg-[#370E62]/40 border-white/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Branch</label>
                <input 
                  type="text" 
                  defaultValue={profile.branch_name || "Head Office"} 
                  disabled 
                  className="w-full bg-[#370E62]/40 border border-white/20 rounded-xl px-4 py-2 text-gray-400 cursor-not-allowed" 
                />
              </div>
            </div>

            {isEditing && (
              <div className="space-y-2 pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">Update Profile Photo</h3>
                <p className="text-sm text-gray-400 mb-4">Upload a new photo (JPG, PNG).</p>
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-[#F5C300] mb-2" />
                      <p className="text-sm text-gray-300">
                        {file ? <span className="font-semibold text-[#F5C300]">{file.name}</span> : <span>Click to upload or drag and drop</span>}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#F5C300] to-[#FFD700] text-[#370E62] font-bold py-2 px-6 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
