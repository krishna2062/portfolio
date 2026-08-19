import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, Copy, Send, MapPin, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('krishnabhandari2062@gmail.com');
    setCopiedEmail(true);
    showToast('Email address copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const showToast = (msg: string, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Please enter a subject.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please provide a message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      if (serviceId && templateId && publicKey) {
        // Send email via EmailJS
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.fullName,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'krishnabhandari2062@gmail.com',
          },
          publicKey
        );
        showToast('Message sent successfully! Thank you for reaching out.');
      } else {
        // Dev/Local fallback when env keys are awaiting configuration
        console.info(
          'EmailJS environment variables not provided. Message details:',
          formData
        );
        showToast('Message submitted successfully! (Configure VITE_EMAILJS_* for live dispatch)');
      }

      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      console.error('EmailJS Submission Error:', error);
      showToast('Unable to send your message right now. Please try again or email directly.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 max-w-6xl mx-auto w-full relative">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white shadow-2xl backdrop-blur-xl flex items-center gap-3 border ${
              toastMessage.isError
                ? 'bg-red-950/95 border-red-500/50'
                : 'bg-neutral-900/95 border-emerald-500/50'
            }`}
          >
            {toastMessage.isError ? (
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Left Side Intro / Right Side Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Contact introduction & info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-6"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-pixel">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
              Contact Me
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base mt-2 leading-relaxed">
              Open for internships, freelance web development, engineering collaborations, and full-stack software roles.
            </p>
          </div>

          {/* Availability Status */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm text-emerald-200 font-medium">
              Available for new projects & engineering opportunities
            </span>
          </div>

          {/* Direct Email Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                <Mail size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-widest text-neutral-400 font-pixel">
                  Direct Email
                </div>
                <a
                  href="mailto:krishnabhandari2062@gmail.com"
                  className="text-sm sm:text-base font-bold text-white hover:text-red-400 transition-colors break-all block mt-0.5"
                >
                  krishnabhandari2062@gmail.com
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Email Address</span>
                </>
              )}
            </button>
          </div>

          {/* Location & Academic Note */}
          <div className="p-5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm flex items-start gap-3 text-xs text-neutral-300">
            <MapPin size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Location & Affiliation</div>
              <p className="text-neutral-400 mt-0.5">
                Nepal • Student at Lumbini Engineering College (Pokhara University)
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <div className="p-6 sm:p-9 rounded-2xl bg-black/45 border border-white/15 backdrop-blur-xl shadow-2xl">
            <div className="border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Send a Message
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Fill out the form below and I will respond as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Row: Full Name & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-neutral-200 mb-1.5 uppercase tracking-wider font-pixel"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="e.g. John Doe"
                    className={`w-full px-4 py-3 rounded-xl bg-black/35 border text-sm text-white placeholder-neutral-500 focus:outline-none transition-all ${
                      errors.fullName
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-white/15 focus:border-red-400 focus:ring-1 focus:ring-red-400/50'
                    }`}
                  />
                  {errors.fullName && (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                      <AlertCircle size={12} />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-neutral-200 mb-1.5 uppercase tracking-wider font-pixel"
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="e.g. john@example.com"
                    className={`w-full px-4 py-3 rounded-xl bg-black/35 border text-sm text-white placeholder-neutral-500 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-white/15 focus:border-red-400 focus:ring-1 focus:ring-red-400/50'
                    }`}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                      <AlertCircle size={12} />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-semibold text-neutral-200 mb-1.5 uppercase tracking-wider font-pixel"
                >
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (errors.subject) setErrors({ ...errors, subject: '' });
                  }}
                  placeholder="e.g. Project Discussion / Full Stack Opportunity"
                  className={`w-full px-4 py-3 rounded-xl bg-black/35 border text-sm text-white placeholder-neutral-500 focus:outline-none transition-all ${
                    errors.subject
                      ? 'border-red-500/80 focus:border-red-500'
                      : 'border-white/15 focus:border-red-400 focus:ring-1 focus:ring-red-400/50'
                  }`}
                />
                {errors.subject && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                    <AlertCircle size={12} />
                    <span>{errors.subject}</span>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-neutral-200 mb-1.5 uppercase tracking-wider font-pixel"
                >
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  placeholder="Hello Krishna, I'd like to talk about..."
                  className={`w-full px-4 py-3 rounded-xl bg-black/35 border text-sm text-white placeholder-neutral-500 focus:outline-none transition-all resize-none ${
                    errors.message
                      ? 'border-red-500/80 focus:border-red-500'
                      : 'border-white/15 focus:border-red-400 focus:ring-1 focus:ring-red-400/50'
                  }`}
                />
                {errors.message && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                    <AlertCircle size={12} />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
