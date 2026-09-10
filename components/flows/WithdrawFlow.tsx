'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CaretRight, Bank, DeviceMobile, Warning, ArrowUp } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS, formatNAV } from '@/lib/formatters';

interface WithdrawFlowProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedFundId?: string;
}

export default function WithdrawFlow({ isOpen, onClose, preselectedFundId }: WithdrawFlowProps) {
  const { funds, portfolio, addWithdrawal } = useStore();
  const [step, setStep] = useState(1);
  const [selectedFundId, setSelectedFundId] = useState<string | null>(preselectedFundId || null);
  const [withdrawType, setWithdrawType] = useState<'full' | 'partial'>('partial');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState<'bank' | 'momo' | null>(null);

  const selectedHolding = portfolio.holdings.find(h => h.fundId === selectedFundId);
  const selectedFund = funds.find(f => f.id === selectedFundId);
  
  const parsedAmount = withdrawType === 'full' 
    ? (selectedHolding?.currentValue || 0) 
    : parseFloat(amount || '0');
    
  const estimatedUnits = selectedFund ? parsedAmount / selectedFund.nav : 0;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleConfirm = () => {
    if (!selectedFundId || parsedAmount <= 0) return;
    addWithdrawal(selectedFundId, parsedAmount);
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
              <h2 className="text-lg font-semibold text-slate-900">Withdraw Funds</h2>
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
                  step === 1 ? 'Select Fund & Type' : 
                  step === 2 ? 'Enter Amount' : 
                  step === 3 ? 'Destination' : 'Review'
                }
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setWithdrawType('partial')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${withdrawType === 'partial' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  >
                    Partial withdrawal
                  </button>
                  <button
                    onClick={() => setWithdrawType('full')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${withdrawType === 'full' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  >
                    Full withdrawal
                  </button>
                </div>
                {portfolio.holdings.map(holding => {
                  const fund = funds.find(f => f.id === holding.fundId);
                  if (!fund) return null;
                  return (
                    <div 
                      key={fund.id}
                      onClick={() => setSelectedFundId(fund.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedFundId === fund.id ? 'border-navy-900 bg-navy-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-900">{fund.name}</h3>
                          <p className="text-sm text-slate-500 mt-1">{formatGHS(holding.currentValue)} available</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {step === 2 && selectedHolding && (
              <div className="space-y-6">
                {withdrawType === 'partial' ? (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-medium text-slate-700">Withdrawal Amount</label>
                      <span className="text-xs text-slate-500">Max available: {formatGHS(selectedHolding.currentValue)}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">GH₵</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        max={selectedHolding.currentValue}
                        className="w-full h-14 pl-14 pr-4 text-2xl font-light tabular-nums border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-lg text-center border border-slate-200">
                    <p className="text-sm text-slate-500 mb-2">Total amount</p>
                    <p className="text-3xl font-light text-slate-900 tabular-nums">{formatGHS(selectedHolding.currentValue)}</p>
                    <p className="text-xs text-slate-400 mt-2">All {selectedHolding.units.toFixed(4)} units will be redeemed.</p>
                  </div>
                )}

                {parsedAmount > 0 && selectedFund && (
                  <div className="bg-slate-50 rounded-lg p-4 flex items-start gap-3">
                    <ArrowUp size={20} className="text-slate-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Estimated units to redeem: {estimatedUnits.toFixed(4)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div 
                  onClick={() => setDestination('bank')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${destination === 'bank' ? 'border-navy-900 bg-navy-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Bank size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Linked Bank Account</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Standard Chartered ••••8291</p>
                  </div>
                </div>
                
                <div 
                  onClick={() => setDestination('momo')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${destination === 'momo' ? 'border-navy-900 bg-navy-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <DeviceMobile size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Mobile Money</h3>
                    <p className="text-sm text-slate-500 mt-0.5">MTN Momo ••••••4092</p>
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
                    <span className="text-slate-500">Units</span>
                    <span className="font-medium text-slate-900">{estimatedUnits.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Estimated proceeds</span>
                    <span className="font-medium text-slate-900">{formatGHS(parsedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Applicable charges</span>
                    <span className="font-medium text-slate-900">None</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Processing period</span>
                    <span className="font-medium text-slate-900">T+2 business days as per SEC Ghana regulations</span>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-6">
                  <Check size={32} weight="bold" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Withdrawal request submitted</h2>
                <p className="text-slate-500 mb-8">Your withdrawal request of {formatGHS(parsedAmount)} from {selectedFund?.name} is being processed.</p>
                
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
                disabled={(step === 1 && !selectedFundId) || (step === 2 && (parsedAmount <= 0 || parsedAmount > (selectedHolding?.currentValue || 0))) || (step === 3 && !destination)}
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
