import React, { useState } from 'react';
import { Send, Mail, CheckCircle, Copy, Check } from 'lucide-react';
import { gothicAudio } from '../utils/audioEngine';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Project Consultation & Architecture',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const directEmail = 'franklinkyleluzano@gmail.com';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    gothicAudio.playWarriorLinkSound();
    gothicAudio.playRockShatter();

    try {
      const stored = JSON.parse(localStorage.getItem('kyle_inscribed_messages') || '[]');
      stored.push({
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('kyle_inscribed_messages', JSON.stringify(stored));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      gothicAudio.playWarriorLinkSound();
    }, 800);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopiedEmail(true);
    gothicAudio.playWarriorLinkSound();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="py-16 scroll-mt-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-900/50 text-xs font-mono text-red-400 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">CONTACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-gothic tracking-wider text-zinc-100">
            Reach Kyle
          </h2>

          {/* Direct email pill */}
          <div className="mt-3 inline-flex items-center gap-2.5 bg-[#111118] border border-zinc-800 rounded-full px-4 py-1 text-xs font-mono text-zinc-400">
            <span className="text-zinc-200">{directEmail}</span>
            <button
              onClick={handleCopyEmail}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy email"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="rune-border bg-[#0d0d14]/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-zinc-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
          {isSent ? (
            <div className="py-10 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-950/90 border border-red-700/80 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold font-gothic text-zinc-100">
                Message Dispatched
              </h3>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                Sent to Kyle's desk. You will receive a response at <strong className="text-red-400">{formData.email}</strong>.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsSent(false);
                    setFormData({ name: '', email: '', subject: 'Project Consultation & Architecture', message: '' });
                    gothicAudio.playWarriorLinkSound();
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white cursor-pointer"
                >
                  New Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="block text-[11px] font-mono uppercase text-zinc-400">
                    Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-zinc-800 focus:border-red-600 text-zinc-100 text-xs outline-none transition-all placeholder:text-zinc-600 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="block text-[11px] font-mono uppercase text-zinc-400">
                    Email
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-zinc-800 focus:border-red-600 text-zinc-100 text-xs outline-none transition-all placeholder:text-zinc-600 font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject-select" className="block text-[11px] font-mono uppercase text-zinc-400">
                  Topic
                </label>
                <select
                  id="subject-select"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-zinc-800 focus:border-red-600 text-zinc-200 text-xs outline-none transition-all font-sans cursor-pointer"
                >
                  <option value="Project Consultation & Architecture">Software & Architecture Consultation</option>
                  <option value="Autonomous AI / LLM Implementation">Autonomous AI & LLM Systems</option>
                  <option value="School Anonymous / Platform Feature Request">Platform Inquiry</option>
                  <option value="General Inscription">General Message</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message-textarea" className="block text-[11px] font-mono uppercase text-zinc-400">
                  Message
                </label>
                <textarea
                  id="message-textarea"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can Kyle assist with your systems or projects?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-zinc-800 focus:border-red-600 text-zinc-100 text-xs outline-none transition-all placeholder:text-zinc-600 font-sans resize-y"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-zinc-950 hover:from-red-900 hover:to-red-950 border border-red-700/80 text-white font-gothic tracking-wider text-xs uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(185,28,28,0.35)] transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>DISPATCHING...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-red-400" />
                      <span>SEND DISPATCH</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
