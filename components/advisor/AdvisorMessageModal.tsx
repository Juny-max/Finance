'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PaperPlaneTilt, CheckCircle, Paperclip, ShieldCheck, Clock, Phone, Envelope } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';

interface AdvisorMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdvisorMessageModal({ isOpen, onClose }: AdvisorMessageModalProps) {
  const { user } = useAuth();
  const { showToast } = useStore();
  
  const advisor = user?.advisor || {
    name: "Ama Serwaa Boateng",
    role: "Senior Relationship Manager",
    email: "ama.boateng@auraasset.com",
    phone: "+233 30 277 4839"
  };

  const [subject, setSubject] = useState("Portfolio Allocation Inquiry");
  const [priority, setPriority] = useState<"standard" | "urgent">("standard");
  const [message, setMessage] = useState("");
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newTicketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(newTicketId);
    setIsSent(true);
    showToast(`Message sent to ${advisor.name} (${newTicketId})`);
  };

  const handleResetAndClose = () => {
    setIsSent(false);
    setMessage("");
    setAttachedFileName(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-navy-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-400">Direct Advisor Channel</span>
              <h2 className="text-xl font-medium tracking-tight mt-0.5">Message Relationship Manager</h2>
            </div>
            <button 
              onClick={handleResetAndClose}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Advisor Identity Strip */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-navy-900 text-gold-400 font-semibold flex items-center justify-center text-sm shadow-sm">
                {advisor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{advisor.name}</h4>
                <p className="text-xs text-slate-500">{advisor.role}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-emerald-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Today
            </div>
          </div>

          {isSent ? (
            /* Success State */
            <div className="p-8 text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle size={32} weight="fill" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Message Successfully Dispatched</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Your communication has been forwarded directly to <strong className="text-slate-700">{advisor.name}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ticket Reference:</span>
                  <span className="font-mono font-medium text-slate-900">{ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-medium text-slate-800">{subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected SLA:</span>
                  <span className="font-medium text-emerald-700">Within 2 business hours</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-md hover:bg-navy-800 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Subject Category</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-navy-900"
                  >
                    <option value="Portfolio Allocation Inquiry">Portfolio Allocation Inquiry</option>
                    <option value="Mandate Review & Rebalancing">Mandate Review & Rebalancing</option>
                    <option value="Liquidity & Redemption Planning">Liquidity & Redemption Planning</option>
                    <option value="Tax & Audit Confirmation Letter">Tax & Audit Confirmation Letter</option>
                    <option value="General Wealth Advisory">General Wealth Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPriority("standard")}
                      className={`flex-1 py-2 text-xs font-medium rounded-md border transition-colors ${
                        priority === "standard"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority("urgent")}
                      className={`flex-1 py-2 text-xs font-medium rounded-md border transition-colors ${
                        priority === "urgent"
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Urgent
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry, requested reallocations, or specific questions for your relationship manager..."
                  className="w-full text-sm border border-slate-200 rounded-md p-3 focus:outline-none focus:border-navy-900 placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Attachments and Security Note */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-navy-900 transition-colors">
                  <Paperclip size={16} />
                  <span>{attachedFileName || "Attach supporting documents (PDF, XLSX)"}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setAttachedFileName(e.target.files[0].name);
                        showToast(`Attached: ${e.target.files[0].name}`, "info");
                      }
                    }}
                  />
                </label>
                <div className="flex items-center gap-1 text-slate-400">
                  <ShieldCheck size={14} />
                  <span>256-Bit Encrypted Channel</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="px-5 py-2 bg-navy-900 text-white text-sm font-medium rounded-md hover:bg-navy-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <PaperPlaneTilt size={16} weight="bold" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

