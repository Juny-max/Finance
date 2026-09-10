'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CaretRight, Bank, DeviceMobile, Warning, Coins } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS, formatNAV } from '@/lib/formatters';

interface InvestFlowProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedFundId?: string;
}

export default function InvestFlow({ isOpen, onClose, preselectedFundId }: InvestFlowProps) {
  const { funds, addInvestment } = useStore();
  const [step, setStep] = useState(1);
  const [selectedFundId, setSelectedFundId] = useState<string | null>(preselectedFundId || null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'momo' | null>(null);

  const selectedFund = funds.find(f => f.id === selectedFundId);
  const parsedAmount = parseFloat(amount || '0');
  const estimatedUnits = selectedFund ? parsedAmount / selectedFund.nav : 0;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleConfirm = () => {
    if (!selectedFundId || parsedAmount <= 0) return;
    addInvestment(selectedFundId, parsedAmount);
    setStep(5);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 5 ? onClose : undefined}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {step < 5 && (
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Make an Investment</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                <X size={20} />
              </button>
            </div>
          )}

          {step < 5 && (
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-navy-900' : 'bg-slate-200'}`} />
                ))}
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-3">
                Step {step} of 4: {
                  step === 1 ? 'Select Fund' : 
                  step === 2 ? 'Enter Amount' : 
                  step === 3 ? 'Payment Method' : 'Review'
                }
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <div className="space-y-4">
                {funds.map(fund => (
                  <div 
                    key={fund.id}
                    onClick={() => setSelectedFundId(fund.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedFundId === fund.id ? 'border-navy-900 bg-navy-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-900">{fund.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{fund.type || fund.assetClass} • {fund.riskLevel} Risk</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{formatNAV(fund.nav)}</p>
                        <p className="text-xs text-slate-500 mt-1">NAV</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">GH₵</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-14 pl-14 pr-4 text-2xl font-light tabular-nums border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 transition-colors"
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {[500, 1000, 2500, 5000, 10000].map(val => (
                    <button
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className="py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors tabular-nums"
                    >
                      +{val}
                    </button>
                  ))}
                </div>

                {parsedAmount > 0 && selectedFund && (
                  <div className="bg-slate-50 rounded-lg p-4 flex items-start gap-3">
                    <Coins size={20} className="text-navy-900 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Estimated units: {estimatedUnits.toFixed(4)} at {formatNAV(selectedFund.nav)} per unit</p>
                      <p className="text-xs text-slate-500 mt-1">Minimum investment notice: Minimum amount is GH₵ 50.00</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div 
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'bank' ? 'border-navy-900 bg-navy-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Bank size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Bank Transfer</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Transfer from linked account ••••8291</p>
                  </div>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'momo' ? 'border-navy-900 bg-navy-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <DeviceMobile size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Mobile Money</h3>
                    <p className="text-sm text-slate-500 mt-0.5">MTN Momo ••••••4092</p>
                  </div>
                </div>

                <div 
                  className="p-4 rounded-lg border-2 border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                    <Coins size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-500">Available balance</h3>
                    <p className="text-sm text-slate-400 mt-0.5">Disabled in prototype</p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-5 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Fund</span>
                    <span className="font-medium text-slate-900">{selectedFund?.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-medium text-slate-900 text-lg">{formatGHS(parsedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Estimated units</span>
                    <span className="font-medium text-slate-900">{estimatedUnits.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Unit price</span>
                    <span className="font-medium text-slate-900">{formatNAV(selectedFund?.nav || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Processing time</span>
                    <span className="font-medium text-slate-900">T+1 business day</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg text-amber-800">
                  <Warning size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm">This transaction will be processed at the closing NAV. Illustrative projection — not guaranteed.</p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <Check size={32} weight="bold" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Investment submitted</h2>
                <p className="text-slate-500 mb-8">Your investment request of {formatGHS(parsedAmount)} into {selectedFund?.name} is being processed.</p>
                
                <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-3 mb-8 mx-auto max-w-sm text-left">
                  <div className="flex justify-between"><span className="text-slate-500">Reference</span><span className="font-mono text-slate-900">INV-{Math.floor(Math.random()*1000000)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="text-slate-900">Today</span></div>
                </div>

                <button
                  onClick={onClose}
                  className="h-12 px-8 font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors w-full max-w-sm mx-auto block"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {step < 5 && (
            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="h-12 px-6 font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex-1"
                >
                  Back
                </button>
              )}
              <button
                onClick={step === 4 ? handleConfirm : handleNext}
                disabled={(step === 1 && !selectedFundId) || (step === 2 && parsedAmount <= 0) || (step === 3 && !paymentMethod)}
                className="h-12 px-6 font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {step === 4 ? 'Confirm' : 'Continue'} {step < 4 && <CaretRight size={16} />}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
