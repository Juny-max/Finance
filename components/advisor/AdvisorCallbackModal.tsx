'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarCheck, PhoneCall, VideoCamera, Buildings, Clock, CheckCircle } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';

interface AdvisorCallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdvisorCallbackModal({ isOpen, onClose }: AdvisorCallbackModalProps) {
  const { user } = useAuth();
  const { showToast } = useStore();

  const advisor = user?.advisor || {
    name: "Ama Serwaa Boateng",
    role: "Senior Relationship Manager",
    email: "ama.boateng@auraasset.com",
    phone: "+233 30 277 4839"
  };

  const [channel, setChannel] = useState<"phone" | "video" | "in_person">("phone");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "+233 24 412 8990");
  const [dateOption, setDateOption] = useState("Today, 10 Sep");
  const [timeSlot, setTimeSlot] = useState("2:00 PM – 3:30 PM GMT");
  const [topic, setTopic] = useState("Comprehensive Portfolio Review");
  const [notes, setNotes] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingId(newBookingId);
    setIsBooked(true);
    showToast(`Consultation requested with ${advisor.name} (${newBookingId})`);
  };

  const handleResetAndClose = () => {
    setIsBooked(false);
    setNotes("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
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
          exit={{ opacity: 0, scale: 1, y: 0 }}
          className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-navy-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-400">Institutional Wealth Advisory</span>
              <h2 className="text-xl font-medium tracking-tight mt-0.5">Schedule Advisor Consultation</h2>
            </div>
            <button 
              onClick={handleResetAndClose}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Advisor Identity Strip */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-slate-50 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-gold-400 shadow-sm sm:h-11 sm:w-11">
                {advisor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{advisor.name}</h4>
                <p className="text-xs text-slate-500">{advisor.role}</p>
              </div>
            </div>
            <div className="hidden text-right text-xs sm:block">
              <span className="text-slate-500 block">Direct Desk</span>
              <span className="font-mono font-medium text-slate-900">{advisor.phone}</span>
            </div>
          </div>

          {isBooked ? (
            /* Success Confirmation */
            <div className="p-8 text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle size={32} weight="fill" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Consultation Confirmed</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  A calendar appointment has been scheduled with <strong className="text-slate-700">{advisor.name}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-5 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono font-semibold text-slate-900">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel:</span>
                  <span className="font-medium text-slate-800 capitalize">
                    {channel === 'phone' ? 'Direct Telephone Call' : channel === 'video' ? 'Secure Video Conference (Google Meet / Teams)' : 'In-Person (Airport Residential Office, Accra)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Window:</span>
                  <span className="font-medium text-slate-900">{dateOption} • {timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discussion Focus:</span>
                  <span className="font-medium text-slate-800">{topic}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => showToast("Calendar invite downloaded (.ics)")}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                >
                  Download .ics Calendar
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2 bg-navy-900 text-white text-sm font-medium rounded-md hover:bg-navy-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBook} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Preferred Consultation Channel</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setChannel("phone")}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      channel === "phone"
                        ? "border-navy-900 bg-navy-50/40 text-navy-900 ring-1 ring-navy-900"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <PhoneCall size={20} className="mb-1.5 text-navy-900" weight={channel === "phone" ? "fill" : "regular"} />
                    <span className="block text-xs font-semibold">Phone Call</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Direct callback</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("video")}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      channel === "video"
                        ? "border-navy-900 bg-navy-50/40 text-navy-900 ring-1 ring-navy-900"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <VideoCamera size={20} className="mb-1.5 text-navy-900" weight={channel === "video" ? "fill" : "regular"} />
                    <span className="block text-xs font-semibold">Video Meeting</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Meet / Teams</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("in_person")}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      channel === "in_person"
                        ? "border-navy-900 bg-navy-50/40 text-navy-900 ring-1 ring-navy-900"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <Buildings size={20} className="mb-1.5 text-navy-900" weight={channel === "in_person" ? "fill" : "regular"} />
                    <span className="block text-xs font-semibold">In-Person</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Accra Office</span>
                  </button>
                </div>
              </div>

              {/* Phone Input (if phone selected) */}
              {channel === "phone" && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Callback Telephone Number</label>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-navy-900 font-mono"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
              )}

              {/* Date & Time slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Select Date</label>
                  <select
                    value={dateOption}
                    onChange={(e) => setDateOption(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-navy-900"
                  >
                    <option value="Today, 10 Sep">Today, 10 Sep</option>
                    <option value="Tomorrow, 11 Sep">Tomorrow, 11 Sep</option>
                    <option value="Monday, 14 Sep">Monday, 14 Sep</option>
                    <option value="Tuesday, 15 Sep">Tuesday, 15 Sep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Time Window (GMT)</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-navy-900"
                  >
                    <option value="9:00 AM – 11:00 AM GMT">Morning (9:00 AM – 11:00 AM)</option>
                    <option value="11:30 AM – 1:30 PM GMT">Midday (11:30 AM – 1:30 PM)</option>
                    <option value="2:00 PM – 3:30 PM GMT">Afternoon (2:00 PM – 3:30 PM)</option>
                    <option value="4:00 PM – 5:00 PM GMT">Late Afternoon (4:00 PM – 5:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Topic Focus */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Primary Agenda / Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-navy-900"
                >
                  <option value="Comprehensive Portfolio Review">Comprehensive Portfolio Review</option>
                  <option value="Additional Capital Allocation Strategy">Additional Capital Allocation Strategy</option>
                  <option value="Mandate Adjustment / Rebalancing">Mandate Adjustment / Rebalancing</option>
                  <option value="Liquidity Planning & Drawdown">Liquidity Planning & Drawdown</option>
                  <option value="Ghana Market & Interest Rate Outlook">Ghana Market & Interest Rate Outlook</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Additional Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific funds or questions you want addressed..."
                  className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-navy-900 placeholder:text-slate-400"
                />
              </div>

              {/* Footer */}
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
                  className="px-5 py-2 bg-navy-900 text-white text-sm font-medium rounded-md hover:bg-navy-800 transition-colors flex items-center gap-2"
                >
                  <CalendarCheck size={16} weight="bold" />
                  <span>Confirm Consultation</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
