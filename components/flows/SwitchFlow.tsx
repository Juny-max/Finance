'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CaretRight, ArrowsLeftRight, Warning } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS, formatNAV } from '@/lib/formatters';

interface SwitchFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SwitchFlow({ isOpen, onClose }: SwitchFlowProps) {
  const { funds, portfolio, addSwitch } = useStore();
  const [step, setStep] = useState(1);
  const [fromFundId, setFromFundId] = useState<string | null>(null);
  const [toFundId, setToFundId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const fromHolding = portfolio.holdings.find(h => h.fundId === fromFundId);
  const fromFund = funds.find(f => f.id === fromFundId);
  const toFund = funds.find(f => f.id === toFundId);
  
  const parsedAmount = parseFloat(amount || '0');
  const unitsOut = fromFund ? parsedAmount / fromFund.nav : 0;
  const estimatedUnitsIn = toFund ? parsedAmount / toFund.nav : 0;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleConfirm = () => {
    if (!fromFundId || !toFundId || parsedAmount <= 0) return;
    addSwitch(fromFundId, toFundId, parsedAmount);
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
              <h2 className="text-lg font-semibold text-slate-900">Switch Funds</h2>
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
                  step === 1 ? 'From' : 
                  step === 2 ? 'To' : 
                  step === 3 ? 'Amount' : 'Review'
                }
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 mb-2">Select the fund you want to move money from.</p>
                {portfolio.holdings.map(holding => {
                  const fund = funds.find(f => f.id === holding.fundId);
                  if (!fund) return null;
                  return (
                    <div 
                      key={fund.id}
                      onClick={() => setFromFundId(fund.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${fromFundId === fund.id ? 'border-navy-900 bg-navy-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
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

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 mb-2">Select the destination fund.</p>
                {funds.filter(f => f.id !== fromFundId).map(fund => (
                  <div 
                    key={fund.id}
                    onClick={() => setToFundId(fund.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${toFundId === fund.id ? 'border-navy-900 bg-navy-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
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

            {step === 3 && fromHolding && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-slate-700">Amount to Switch</label>
                    <span className="text-xs text-slate-500">Max available: {formatGHS(fromHolding.currentValue)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">GH₵</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      max={fromHolding.currentValue}
                      className="w-full h-14 pl-14 pr-4 text-2xl font-light tabular-nums border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 transition-colors"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setAmount((fromHolding.currentValue * (pct/100)).toString())}
                      className="py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                {parsedAmount > 0 && toFund && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                    <ArrowsLeftRight size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Estimated units in: {estimatedUnitsIn.toFixed(4)}</p>
                      <p className="text-xs text-slate-500 mt-1">Based on current NAV of {formatNAV(toFund.nav)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-5 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">From fund</span>
                    <span className="font-medium text-slate-900 text-right">{fromFund?.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">To fund</span>
                    <span className="font-medium text-slate-900 text-right">{toFund?.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-medium text-slate-900 text-lg">{formatGHS(parsedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Units out</span>
                    <span className="font-medium text-slate-900">{unitsOut.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Estimated units in</span>
                    <span className="font-medium text-slate-900">{estimatedUnitsIn.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500">Charges</span>
                    <span className="font-medium text-slate-900">None for prototype</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Processing time</span>
                    <span className="font-medium text-slate-900">T+1 business day</span>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <ArrowsLeftRight size={32} weight="bold" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Switch submitted</h2>
                <p className="text-slate-500 mb-8">Your request to switch {formatGHS(parsedAmount)} to {toFund?.name} is being processed.</p>
                
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
                disabled={(step === 1 && !fromFundId) || (step === 2 && !toFundId) || (step === 3 && (parsedAmount <= 0 || parsedAmount > (fromHolding?.currentValue || 0)))}
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
