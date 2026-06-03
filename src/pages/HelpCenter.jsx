import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, MapPin, Phone, User, Smartphone, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { glassmorphicStyles } from '../theme';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const HelpCenter = () => {
  const [formData, setFormData] = useState({ name: '', phone_no: '', email: '', problem_description: '' });
  const [status, setStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('http://localhost:8000/api/helpcenter/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone_no: '', email: '', problem_description: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const socialLinks = [
    { icon: <Globe size={18} />, label: "Website", href: "#" },
    { icon: <Mail size={18} />, label: "Email", href: "#" },
    { icon: <MapPin size={18} />, label: "Location", href: "#" },
    { icon: <Phone size={18} />, label: "Call", href: "#" }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-4xl mx-auto flex flex-col gap-8 pb-10"
    >
      <motion.div variants={itemVariants} className={`p-12 text-center relative overflow-hidden rounded-2xl ${glassmorphicStyles.card}`}>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-72 h-36 bg-[#9E161B] blur-[80px] opacity-20 z-0" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-6 flex items-center justify-center bg-white/40 p-4 rounded-3xl w-max shadow-2xl border border-[#C0BEC5]/30"
          >
            <img src="/assets/V-Wings_Logo_nobg.png" alt="VWings24x7 Logo" className="w-20 h-20 rounded-xl object-contain" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-2 text-[#C0BEC5]">
            Admin Support Center
          </h2>
          <p className="text-[#373F52] mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Get in touch with the VWings24x7 administration team for any queries or support requests.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {socialLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(245, 195, 0, 0.1)' }}
                className="flex items-center gap-2 text-[#373F52] bg-white/40 px-5 py-2.5 rounded-full border border-[#C0BEC5]/30 hover:text-[#C0BEC5] hover:border-[#C0BEC5] transition-all"
              >
                {link.icon}
                <span className="text-sm font-medium">{link.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={`p-10 rounded-2xl ${glassmorphicStyles.card}`}>
        <div className="mb-8 text-center">
          <h3 className="text-[var(--text-main)] text-2xl font-bold mb-2">Submit a Query to Admin</h3>
          <p className="text-[#373F52]">We are here to help. Send us your query and the admin team will resolve it promptly.</p>
        </div>

        <form onSubmit={handleSubmitTicket} className="flex flex-col gap-5 max-w-2xl mx-auto">
          <AnimatePresence>
            {status === 'success' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div className="flex items-center gap-3 text-green-300 p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-2">
                  <CheckCircle size={24} className="text-green-300" />
                  <strong className="text-green-300">Your support ticket has been submitted successfully!</strong>
                </div>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div className="flex items-center gap-3 text-red-300 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-2">
                  <AlertCircle size={24} />
                  <strong>Failed to submit ticket. Please try again.</strong>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-5 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <User size={18} className={`absolute left-4 top-4 transition-colors ${focusedField === 'name' ? 'text-[#C0BEC5]' : 'text-[#373F52]'}`} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Full name"
                className={`w-full py-3.5 px-4 pl-12 bg-black/20 border rounded-xl text-[var(--text-main)] outline-none transition-all ${focusedField === 'name' ? 'border-[#C0BEC5] ring-2 ring-[#C0BEC5]/20' : 'border-[var(--border)]'}`}
              />
            </div>

            <div className="relative flex-1 min-w-[250px]">
              <Smartphone size={18} className={`absolute left-4 top-4 transition-colors ${focusedField === 'phone' ? 'text-[#C0BEC5]' : 'text-[#373F52]'}`} />
              <input
                type="tel"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Phone number"
                className={`w-full py-3.5 px-4 pl-12 bg-black/20 border rounded-xl text-[var(--text-main)] outline-none transition-all ${focusedField === 'phone' ? 'border-[#C0BEC5] ring-2 ring-[#C0BEC5]/20' : 'border-[var(--border)]'}`}
              />
            </div>
          </div>

          <div className="relative">
            <Mail size={18} className={`absolute left-4 top-4 transition-colors ${focusedField === 'email' ? 'text-[#C0BEC5]' : 'text-[#373F52]'}`} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Email address"
              className={`w-full py-3.5 px-4 pl-12 bg-black/20 border rounded-xl text-[var(--text-main)] outline-none transition-all ${focusedField === 'email' ? 'border-[#C0BEC5] ring-2 ring-[#C0BEC5]/20' : 'border-[var(--border)]'}`}
            />
          </div>

          <div className="relative">
            <MessageSquare size={18} className={`absolute left-4 top-4 transition-colors ${focusedField === 'desc' ? 'text-[#C0BEC5]' : 'text-[#373F52]'}`} />
            <textarea
              name="problem_description"
              value={formData.problem_description}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('desc')}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Please describe your issue in detail..."
              className={`w-full py-3.5 px-4 pl-12 bg-black/20 border rounded-xl text-[var(--text-main)] outline-none min-h-[140px] resize-y transition-all ${focusedField === 'desc' ? 'border-[#C0BEC5] ring-2 ring-[#C0BEC5]/20' : 'border-[var(--border)]'}`}
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === 'submitting'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#7B0771] to-[#9E161B] text-white shadow-lg font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-3 hover:opacity-90 transition-opacity shadow-[0_10px_25px_rgba(245,195,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Submitting ticket...' : (
              <>
                Submit Ticket <Send size={20} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HelpCenter;
