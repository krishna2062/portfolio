"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { BsArrowRight } from "react-icons/bs";
import { HiMail, HiPhone, HiLocationMarker, HiGlobeAlt } from "react-icons/hi";

import { fadeIn } from "@/variants";
import Circles from "@/components/Circles";
import emailjs from '@emailjs/browser';
import { api, PublicProfile } from "@/lib/api";

const Contact = () => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getProfile().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Save directly to Supabase Database
      const dbResult = await api.submitContact(form);

      // 2. Client-side notification via EmailJS if keys are available
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_enwlwan";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_hgrnf5r";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "2F8kgU3tj7fxxsicn";

      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
          },
          publicKey
        );
      } catch (emailErr) {
        console.warn("EmailJS notification optional send error:", emailErr);
      }

      toast.success("Message sent successfully! I’ll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Contact Submission Error:', error);
      toast.error("Unable to send your message right now. Please try again or contact me directly.");
    } finally {
      setIsLoading(false);
    }
  };

  const phone = profile?.phoneWhatsApp || "+977 9867165211";
  const email = profile?.contactEmail || "krishnabhandari2062@gmail.com";
  const location = profile?.location || "Butwal, Lumbini Province, Nepal";
  const domain = profile?.domainEmail ? "krishnabhandari01.com.np" : "krishnabhandari01.com.np";

  return (
    <div className="min-h-screen h-auto bg-primary/30 pt-24 lg:pt-36 pb-28 lg:pb-12 flex items-center justify-center relative overflow-y-auto overflow-x-hidden">
      <Circles />
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 max-w-6xl z-10 py-8 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: Info */}
          <motion.div 
            variants={fadeIn('right', 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="lg:col-span-5 flex flex-col justify-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Let&apos;s <span className="text-[#f13024]">connect.</span>
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              I am open to discussing backend systems, web platforms, and engineering collaborations.
            </p>

            <div className="space-y-4 pt-2 w-full">
              {/* Phone / WhatsApp */}
              <a 
                href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f13024]/50 transition-colors w-full"
              >
                <div className="text-[#f13024] text-2xl"><HiPhone/></div>
                <div>
                  <p className="text-xs text-white/50">Phone / WhatsApp</p>
                  <p className="text-sm font-medium text-white">{phone}</p>
                </div>
              </a>

              {/* Email */}
              <a 
                href={`mailto:${email}`} 
                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f13024]/50 transition-colors w-full"
              >
                <div className="text-[#f13024] text-2xl"><HiMail/></div>
                <div>
                  <p className="text-xs text-white/50">Email Address</p>
                  <p className="text-sm font-medium text-white break-all">{email}</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f13024]/50 transition-colors w-full">
                <div className="text-[#f13024] text-2xl"><HiLocationMarker/></div>
                <div>
                  <p className="text-xs text-white/50">Location</p>
                  <p className="text-sm font-medium text-white">{location}</p>
                </div>
              </div>

              {/* Website */}
              <a 
                href="https://www.krishnabhandari01.com.np"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#f13024]/50 transition-colors w-full"
              >
                <div className="text-[#f13024] text-2xl"><HiGlobeAlt/></div>
                <div>
                  <p className="text-xs text-white/50">Website</p>
                  <p className="text-sm font-medium text-white break-all">{domain}</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Form */}
          <motion.div 
            variants={fadeIn('left', 0.4)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="lg:col-span-7 bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md w-full mt-4 lg:mt-0"
          >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Name *" 
                  required 
                  className="w-full min-h-[48px] bg-white/5 border border-white/20 focus:border-[#f13024] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email *" 
                  required 
                  className="w-full min-h-[48px] bg-white/5 border border-white/20 focus:border-[#f13024] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <input 
                type="text" 
                name="subject"
                placeholder="Subject *" 
                required 
                className="w-full min-h-[48px] bg-white/5 border border-white/20 focus:border-[#f13024] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                value={form.subject}
                onChange={handleChange}
                disabled={isLoading}
              />
              <textarea 
                name="message"
                placeholder="Message *" 
                rows={5} 
                required 
                className="w-full min-h-[120px] bg-white/5 border border-white/20 focus:border-[#f13024] rounded-lg px-4 py-3 text-white outline-none transition-colors resize-none"
                value={form.message}
                onChange={handleChange}
                disabled={isLoading}
              />
              
              <button 
                type="submit" 
                className="btn rounded-full border border-white/50 max-w-[170px] px-8 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-[#f13024] group disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] mt-2"
                disabled={isLoading}
              >
                <span className={isLoading ? "" : "group-hover:-translate-y-[120%] group-hover:opacity-0 transition-all duration-500 font-medium"}>
                  {isLoading ? "Sending..." : "Let's talk"}
                </span>
                {!isLoading && (
                  <BsArrowRight className="-translate-y-[120%] opacity-0 group-hover:flex group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]"/>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
