'use client';
import { useState } from 'react';
import { Lock, ShieldCheck, DeviceMobile, Globe, Info } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/formatters';

export default function SecurityPage() {
  const { showToast } = useStore();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Security</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account security and preferences</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
        {/* Password */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-slate-400" /> Password
          </h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900" />
            </div>
            <button onClick={() => showToast('Password updated successfully')} className="mt-2 h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors">
              Update Password
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* 2FA */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-slate-400" /> Two-Factor Authentication (2FA)
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Add an extra layer of security to your account. When enabled, you'll be required to provide a code from an authenticator app when logging in.
              </p>
              {!is2FAEnabled && (
                <div className="flex items-center gap-2 mt-4 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md w-max">
                  <Info size={16} /> We recommend enabling 2FA for additional security.
                </div>
              )}
            </div>
            <button 
              onClick={() => {
                setIs2FAEnabled(!is2FAEnabled);
                showToast(is2FAEnabled ? '2FA disabled' : '2FA enabled');
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${is2FAEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${is2FAEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Active Sessions */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Globe size={20} className="text-slate-400" /> Active Sessions
            </h2>
            <button onClick={() => showToast('All other sessions signed out')} className="text-sm font-medium text-red-600 hover:text-red-700">
              Sign out all other devices
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-emerald-200 bg-emerald-50/30 rounded-lg">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded">
                <Globe size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 flex items-center gap-2">Mac OS • Safari <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Current Session</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Accra, Ghana • 197.251.10.12</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="p-2 bg-slate-100 text-slate-600 rounded">
                <DeviceMobile size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">iOS • Safari</p>
                <p className="text-xs text-slate-500 mt-0.5">Accra, Ghana • Active 2 days ago</p>
              </div>
              <button className="text-sm text-slate-500 hover:text-slate-900">Revoke</button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Notification Preferences */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Notification Preferences</h2>
          <div className="space-y-4 max-w-md">
            {[
              { id: 'inv', label: 'Investment confirmations', defaultChecked: true },
              { id: 'wd', label: 'Withdrawal alerts', defaultChecked: true },
              { id: 'stmt', label: 'Statement availability', defaultChecked: true },
              { id: 'price', label: 'Fund price updates', defaultChecked: false },
              { id: 'sec', label: 'Security alerts', defaultChecked: true },
            ].map(pref => (
              <label key={pref.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" defaultChecked={pref.defaultChecked} className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 checked:border-navy-900 checked:bg-navy-900 transition-all" />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                </div>
                <span className="text-sm text-slate-700 group-hover:text-slate-900">{pref.label}</span>
              </label>
            ))}
            <button onClick={() => showToast('Preferences saved')} className="mt-4 h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
