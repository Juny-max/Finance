'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const submit = () => router.push('/');

  return (
    <div className="w-full max-w-lg mx-auto py-12">
      {/* Mobile Branding Header */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <Image
          src="/logo-without text.png"
          alt="Aura Asset Management"
          width={36}
          height={36}
          className="w-9 h-9 object-contain"
        />
        <div>
          <div className="text-sm font-semibold text-navy-900 tracking-wider">AURA ASSET MANAGEMENT</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Account Onboarding</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-navy-900 transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide">
          STEP {step} OF {totalSteps}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                  <input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                  <input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of birth</label>
                <input type="date" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md text-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghana Card number (Optional)</label>
                <input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Account Type</h2>
              <div className="grid grid-cols-1 gap-3">
                {['Individual', 'Joint', 'Corporate', 'Trust/Institutional'].map((type) => (
                  <button key={type} className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-navy-900 hover:bg-slate-50 transition-colors text-left">
                    <span className="font-medium text-slate-900">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Investment Preferences</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Investment Goal</label>
                <select className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white">
                  <option>Wealth Growth</option>
                  <option>Income Generation</option>
                  <option>Capital Preservation</option>
                  <option>Retirement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time Horizon</label>
                <select className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white">
                  <option>Less than 1 year</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial investment amount (GH₵)</label>
                <input type="number" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Risk Profile</h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { title: 'Conservative', desc: 'Focus on capital preservation with minimal risk.' },
                  { title: 'Moderate', desc: 'Balance of growth and stability.' },
                  { title: 'Balanced', desc: 'Equal focus on capital appreciation and income.' },
                  { title: 'Growth', desc: 'Maximize long-term returns, willing to accept volatility.' },
                ].map((risk) => (
                  <button key={risk.title} className="flex flex-col p-4 border border-slate-200 rounded-lg hover:border-navy-900 hover:bg-slate-50 transition-colors text-left">
                    <span className="font-medium text-slate-900">{risk.title}</span>
                    <span className="text-sm text-slate-500 mt-1">{risk.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Funding Method</h2>
              <div className="grid grid-cols-1 gap-3">
                {['Bank Transfer', 'Mobile Money'].map((method) => (
                  <button key={method} className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-navy-900 hover:bg-slate-50 transition-colors text-left">
                    <span className="font-medium text-slate-900">{method}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Review & Complete</h2>
              <div className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50">
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Personal Info</span>
                  <p className="text-sm text-slate-900 mt-1">John Doe, +233 20 123 4567</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Account Type</span>
                  <p className="text-sm text-slate-900 mt-1">Individual</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Goal & Horizon</span>
                  <p className="text-sm text-slate-900 mt-1">Wealth Growth, 5+ years</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Risk Profile</span>
                  <p className="text-sm text-slate-900 mt-1">Balanced</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="h-10 px-5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        {step < totalSteps ? (
          <button
            onClick={nextStep}
            className="h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={submit}
            className="h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors"
          >
            Create account
          </button>
        )}
      </div>
    </div>
  );
}
