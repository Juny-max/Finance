'use client';
import { UserCircle, MapPin, Phone, Envelope, Bank, DeviceMobile, ShieldCheck, Clock, XCircle } from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-navy-100 text-navy-900 flex items-center justify-center text-xl font-bold">
          {user?.name ? user.name.charAt(0) : (user?.firstName ? user.firstName.charAt(0) : "U")}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Investor'}</h1>
          <p className="text-sm text-slate-500 mt-1">Account • {user?.id.split('-')[0].toUpperCase()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
        {/* Personal Information */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
            <button 
              onClick={() => showToast('Contact your advisor to update personal information')}
              className="text-sm font-medium text-navy-900 hover:text-navy-800"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Full Name</p>
              <p className="font-medium text-slate-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Email Address</p>
              <p className="font-medium text-slate-900 flex items-center gap-2"><Envelope size={16} className="text-slate-400" /> {user?.email}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Phone Number</p>
              <p className="font-medium text-slate-900 flex items-center gap-2"><Phone size={16} className="text-slate-400" /> +233 54 123 4567</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Address</p>
              <p className="font-medium text-slate-900 flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> 14 Senchi St, Accra, Ghana</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Date of Birth</p>
              <p className="font-medium text-slate-900">15 Jan 1985</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Account Details */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Account Type</p>
              <p className="font-medium text-slate-900 capitalize">{user?.accountType || 'Individual'}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Risk Profile</p>
              <p className="font-medium text-slate-900">Balanced</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">KYC Status</p>
              {user?.kycStatus === 'verified' ? (
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded text-xs font-medium w-max mt-0.5">
                  <ShieldCheck size={14} weight="bold" />
                  <span>Verified</span>
                </div>
              ) : user?.kycStatus === 'rejected' ? (
                <div className="flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded text-xs font-medium w-max mt-0.5">
                  <XCircle size={14} weight="bold" />
                  <span>Verification Declined</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded text-xs font-medium w-max mt-0.5">
                  <Clock size={14} weight="bold" />
                  <span>Pending Review</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-slate-500 mb-1">Member Since</p>
              <p className="font-medium text-slate-900">10 Sep 2023</p>
            </div>
          </div>
        </div>

        {user?.accountType === 'institutional' && (
          <>
            <div className="border-t border-slate-100" />
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Trustees / Signatories</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">John Doe</p>
                    <p className="text-xs text-slate-500 mt-0.5">Primary Signatory</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Jane Smith</p>
                    <p className="text-xs text-slate-500 mt-0.5">Secondary Signatory</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">Active</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="border-t border-slate-100" />

        {/* Linked Bank Accounts */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Linked Bank Accounts</h2>
            <button 
              onClick={() => showToast('Feature coming soon')}
              className="text-sm font-medium text-navy-900 hover:text-navy-800"
            >
              Add bank account
            </button>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
              <Bank size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900">Standard Chartered Bank</p>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded uppercase tracking-wider">Primary</span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">Account ••••8291</p>
              <p className="text-xs text-slate-400 mt-0.5">Airport Branch</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Mobile Money */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Mobile Money</h2>
            <button 
              onClick={() => showToast('Feature coming soon')}
              className="text-sm font-medium text-navy-900 hover:text-navy-800"
            >
              Add mobile money
            </button>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
              <DeviceMobile size={24} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">MTN Mobile Money</p>
              <p className="text-sm text-slate-500 mt-0.5">••••••4092</p>
              <p className="text-xs text-slate-400 mt-0.5">Registered Name: {user?.name}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Beneficiaries */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Beneficiaries</h2>
            <button 
              onClick={() => showToast('Feature coming soon')}
              className="text-sm font-medium text-navy-900 hover:text-navy-800"
            >
              Add beneficiary
            </button>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <UserCircle size={20} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Sarah {user?.name ? user.name.split(' ')[1] : 'Mensah'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Spouse • +233 54 987 6543</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">100%</p>
              <p className="text-xs text-slate-500">Allocation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
