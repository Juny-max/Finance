'use client';
import { Envelope, Phone, Calendar, Coins, ArrowUp, ArrowsLeftRight, FileText, UserCircle, Lock, CaretDown, Clock } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupportPage() {
  const { showToast } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I invest in a Bora fund?',
      a: 'To invest, click the "Invest" button on your dashboard or navigate to a specific fund page. Select your funding method (Bank Transfer or Mobile Money), enter the amount, and confirm. Your units will be allocated at the closing NAV of T+1 business day.'
    },
    {
      q: 'How long does a withdrawal take?',
      a: 'Withdrawal requests are typically processed within T+2 business days as per SEC Ghana regulations. Funds will be sent directly to your primary linked bank account or mobile money wallet.'
    },
    {
      q: 'What are the management fees?',
      a: 'Management fees vary by fund, typically ranging from 1.5% to 2.5% per annum. These fees are accrued daily and are already reflected in the published Net Asset Value (NAV) of the funds. There are no front-load or back-load fees for our standard retail funds.'
    },
    {
      q: 'How is my money protected?',
      a: 'Bora Capital Advisors is licensed and regulated by the Securities and Exchange Commission (SEC) of Ghana. All fund assets are held by an independent custodian bank, ensuring separation of client assets from management company assets.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Help & Support</h1>
        <p className="text-sm text-slate-500 mt-1">How can we help you today?</p>
      </div>

      <div className="bg-navy-900 rounded-lg p-6 sm:p-8 text-white flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-semibold border border-white/20">
            K
          </div>
          <div>
            <p className="text-navy-100 text-sm font-medium uppercase tracking-wider mb-1">Your Dedicated Advisor</p>
            <h2 className="text-xl font-semibold">Kwame Mensah</h2>
            <p className="text-navy-200 text-sm">Senior Wealth Manager</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button onClick={() => showToast('Messaging prototype')} className="flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium text-navy-900 bg-white rounded-md hover:bg-slate-50 transition-colors w-full">
            <Envelope size={18} /> Message advisor
          </button>
          <div className="flex gap-2">
            <button onClick={() => showToast('Callback requested')} className="flex-1 flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition-colors">
              <Phone size={18} /> Call
            </button>
            <button onClick={() => showToast('Calendar prototype')} className="flex-1 flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition-colors">
              <Calendar size={18} /> Book
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: <Coins size={24} weight="duotone" />, title: 'Investments', desc: 'How to invest, fund selection, investment minimums' },
          { icon: <ArrowUp size={24} weight="duotone" />, title: 'Withdrawals', desc: 'Redemption process, processing times, charges' },
          { icon: <ArrowsLeftRight size={24} weight="duotone" />, title: 'Fund switching', desc: 'Switch between Bora funds' },
          { icon: <FileText size={24} weight="duotone" />, title: 'Statements', desc: 'Access and download your documents' },
          { icon: <UserCircle size={24} weight="duotone" />, title: 'Account', desc: 'Profile, KYC, account settings' },
          { icon: <Lock size={24} weight="duotone" />, title: 'Security', desc: 'Password, 2FA, login activity' },
        ].map(cat => (
          <div key={cat.title} onClick={() => showToast('Support category prototype')} className="bg-white p-5 rounded-lg border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex gap-4 items-start">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg shrink-0">
              {cat.icon}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{cat.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-4">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg border border-slate-200/60 divide-y divide-slate-100">
            {faqs.map((faq, i) => (
              <div key={i} className="overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-medium text-slate-900">{faq.q}</span>
                  <CaretDown size={16} className={`text-slate-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-sm text-slate-600"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200/60">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Phone size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">+233 30 277 4839</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Envelope size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-medium text-slate-900">support@boracapital.com</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500">Business Hours</p>
                <p className="font-medium text-slate-900">Mon - Fri, 8:00 AM - 5:00 PM GMT</p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200">
              <p className="font-medium text-slate-900">Head Office</p>
              <p className="text-slate-600 mt-1">No. 14 Senchi Street,<br/>Airport Residential Area,<br/>Accra, Ghana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
