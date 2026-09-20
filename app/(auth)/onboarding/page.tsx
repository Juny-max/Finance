'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { saveToStorage, STORAGE_KEYS } from '@/lib/persistence';

export default function OnboardingPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { addApplication, addInvestment, funds } = useStore();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('Individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'balanced' | 'growth'>('balanced');
  const [fundingMethod, setFundingMethod] = useState('Bank Transfer');
  const [bankName, setBankName] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [momoNetwork, setMomoNetwork] = useState('MTN Mobile Money');
  const [momoAccountName, setMomoAccountName] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoWalletType, setMomoWalletType] = useState('Subscriber / Personal');
  const [managementStyle, setManagementStyle] = useState('Aura Managed');
  const [statementDelivery, setStatementDelivery] = useState('Email');
  const [statementFrequency, setStatementFrequency] = useState('Monthly');
  const [sourceOfFunds, setSourceOfFunds] = useState('Salary / personal savings');
  const [investmentGoal, setInvestmentGoal] = useState('Wealth Growth');
  const [timeHorizon, setTimeHorizon] = useState('5+ years');
  const [initialAmount, setInitialAmount] = useState('10000');
  const totalSteps = 6;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const submit = () => {
    if (!firstName || !lastName || !email || !password) {
      alert('Please complete your name, email address and password.');
      setStep(1);
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      setStep(1);
      return;
    }
    const accountTypeMap = {
      'Individual': 'individual',
      'Joint Account': 'joint',
      'Institution': 'institutional',
      'Collective Investment Scheme': 'institutional',
    } as const;

    const parsedAmount = parseFloat(initialAmount) || 10000;
    const bankAccounts = fundingMethod === 'Bank Transfer' && bankName ? [{
      id: `ba_${Date.now()}`,
      bank: bankName,
      accountNumber: bankAccountNumber || '9040001234567',
      branch: bankBranch || 'Main Branch',
      primary: true,
    }] : [];
    const momoAccounts = fundingMethod === 'Mobile Money' && momoNumber ? [{
      id: `momo_${Date.now()}`,
      network: (momoNetwork.includes('MTN') ? 'MTN' : momoNetwork.includes('Telecel') ? 'Telecel' : 'AT') as "MTN" | "Telecel" | "AT",
      number: momoNumber,
      name: momoAccountName || `${firstName} ${lastName}`,
    }] : [];

    const result = signup({
      firstName,
      lastName,
      email,
      password,
      phone,
      riskProfile,
      accountType: accountTypeMap[accountType as keyof typeof accountTypeMap],
      bankAccounts,
      momoAccounts,
    });
    if (!result.success) {
      alert(result.error || 'We could not create your account.');
      return;
    }
    saveToStorage(STORAGE_KEYS.ONBOARDING_DRAFT, {
      firstName,
      lastName,
      email,
      phone,
      accountType,
      riskProfile,
      investmentGoal,
      timeHorizon,
      initialAmount: parsedAmount,
      fundingMethod,
      bankName: fundingMethod === 'Bank Transfer' ? bankName : undefined,
      bankAccountName: fundingMethod === 'Bank Transfer' ? bankAccountName : undefined,
      bankAccountNumber: fundingMethod === 'Bank Transfer' ? bankAccountNumber : undefined,
      bankBranch: fundingMethod === 'Bank Transfer' ? bankBranch : undefined,
      momoNetwork: fundingMethod === 'Mobile Money' ? momoNetwork : undefined,
      momoAccountName: fundingMethod === 'Mobile Money' ? momoAccountName : undefined,
      momoNumber: fundingMethod === 'Mobile Money' ? momoNumber : undefined,
      momoWalletType: fundingMethod === 'Mobile Money' ? momoWalletType : undefined,
      managementStyle,
      statementDelivery,
      statementFrequency,
      sourceOfFunds,
      completedAt: new Date().toISOString(),
    });

    const refNumber = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    addApplication({
      id: `app_${Date.now()}`,
      reference: refNumber,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      accountCategory: accountType as any,
      applicantName: `${firstName} ${lastName}`,
      email,
      phone,
      riskProfile,
      managementStyle,
      investmentGoal,
      timeHorizon,
      initialAmount: parsedAmount,
      fundingMethod: fundingMethod as any,
      bankName: fundingMethod === 'Bank Transfer' ? bankName : undefined,
      bankAccountName: fundingMethod === 'Bank Transfer' ? bankAccountName : undefined,
      bankAccountNumber: fundingMethod === 'Bank Transfer' ? bankAccountNumber : undefined,
      bankBranch: fundingMethod === 'Bank Transfer' ? bankBranch : undefined,
      momoNetwork: fundingMethod === 'Mobile Money' ? momoNetwork : undefined,
      momoAccountName: fundingMethod === 'Mobile Money' ? momoAccountName : undefined,
      momoNumber: fundingMethod === 'Mobile Money' ? momoNumber : undefined,
      momoWalletType: fundingMethod === 'Mobile Money' ? momoWalletType : undefined,
      sourceOfFunds,
      statementDelivery,
      statementFrequency,
      documents: {
        nationalId: true,
        proofOfAddress: true,
        passportOrMandate: true,
        institutionalResolution: accountType === 'Institution' || accountType === 'Collective Investment Scheme',
      },
      complianceNotes: 'Awaiting compliance review and verification under SEC Ghana guidelines.',
    });

    if (parsedAmount > 0 && result.user) {
      const defaultFund = funds[0]?.id || 'aura-balanced-fund';
      addInvestment({
        fundId: defaultFund,
        amount: parsedAmount,
        method: fundingMethod,
        status: 'processing',
        userId: result.user.id,
      });
    }

    router.push('/');
  };

  return (
    <div className="w-full max-w-lg mx-auto py-12">
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
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">Start your account opening</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your personal and login details. The application will adapt to your client category in the next step.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} required type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Password</label><input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label><input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required type="password" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div>
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
                {[
                  ['Individual', 'For a single investor opening a unit trust or private wealth account.'],
                  ['Joint Account', 'For two or more account holders with an agreed signing mandate.'],
                  ['Institution', 'For companies, pension schemes, trusts and other legal entities.'],
                  ['Collective Investment Scheme', 'For a scheme, fund or collective vehicle managed under an investment mandate.'],
                ].map(([type, description]) => (
                  <button key={type} onClick={() => setAccountType(type)} className={`flex flex-col p-4 border rounded-lg hover:border-navy-900 hover:bg-slate-50 transition-colors text-left ${accountType === type ? 'border-navy-900 bg-navy-50/40 ring-1 ring-navy-900' : 'border-slate-200'}`}>
                    <span className="font-medium text-slate-900">{type}</span>
                    <span className="mt-1 text-sm text-slate-500">{description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">{accountType === 'Individual' ? 'Investment Preferences' : `${accountType} details`}</h2>
              {accountType !== 'Individual' && <p className="text-sm text-slate-500 mb-4">Information required to prepare your account-opening application and signing mandate.</p>}
              {accountType === 'Joint Account' && <>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Second account holder&apos;s full name</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Second holder email</label><input type="email" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Second holder phone</label><input type="tel" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Operating mandate</label><select className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"><option>Either to sign</option><option>Both to sign</option><option>Any two to sign</option></select></div>
              </>}
              {accountType === 'Institution' && <>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Registered institution name</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Registration number</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Authorised signatories</label><input type="number" min="1" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Nature of business / sector</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Registered office / digital address</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div></div>
              </>}
              {accountType === 'Collective Investment Scheme' && <>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Scheme name</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Scheme registration number</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Trustee / custodian</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Fund manager / authorised representative</label><input type="text" className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md" /></div>
              </>}
              <div className="border-t border-slate-100 pt-5 mt-6"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Account service preferences</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Portfolio management</label><select value={managementStyle} onChange={(e) => setManagementStyle(e.target.value)} className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"><option>Aura Managed</option><option>Client Managed</option></select></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Source of funds</label><select value={sourceOfFunds} onChange={(e) => setSourceOfFunds(e.target.value)} className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"><option>Salary / personal savings</option><option>Business proceeds</option><option>Investment proceeds</option><option>Inheritance / gifts</option><option>Other</option></select></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Statement delivery</label><select value={statementDelivery} onChange={(e) => setStatementDelivery(e.target.value)} className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"><option>Email</option><option>SMS notification</option><option>Collection</option><option>Post</option></select></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Statement frequency</label><select value={statementFrequency} onChange={(e) => setStatementFrequency(e.target.value)} className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"><option>Monthly</option><option>Quarterly</option></select></div></div></div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Investment Goal</label>
                <select
                  value={investmentGoal}
                  onChange={(e) => setInvestmentGoal(e.target.value)}
                  className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"
                >
                  <option>Wealth Growth</option>
                  <option>Income Generation</option>
                  <option>Capital Preservation</option>
                  <option>Retirement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time Horizon</label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"
                >
                  <option>Less than 1 year</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial investment amount (GH₵)</label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md"
                />
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
                  <button key={risk.title} onClick={() => setRiskProfile(risk.title.toLowerCase() as typeof riskProfile)} className={`flex flex-col p-4 border rounded-lg hover:border-navy-900 hover:bg-slate-50 transition-colors text-left ${riskProfile === risk.title.toLowerCase() ? 'border-navy-900 bg-navy-50/40 ring-1 ring-navy-900' : 'border-slate-200'}`}>
                    <span className="font-medium text-slate-900">{risk.title}</span>
                    <span className="text-sm text-slate-500 mt-1">{risk.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">Funding & verification</h2>
              <p className="text-sm text-slate-500 mb-5">Add your preferred funding route and the documents required for review.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Bank Transfer', 'Mobile Money'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFundingMethod(method)}
                    className={`flex flex-col p-4 border rounded-lg hover:border-navy-900 hover:bg-slate-50 transition-colors text-left ${
                      fundingMethod === method ? 'border-navy-900 bg-navy-50/40 ring-1 ring-navy-900' : 'border-slate-200'
                    }`}
                  >
                    <span className="font-medium text-slate-900">{method}</span>
                    <span className="text-xs text-slate-500 mt-1">
                      {method === 'Bank Transfer' ? 'Direct bank deposit or standing order' : 'Instant deposit via MTN, Telecel, or AT Money'}
                    </span>
                  </button>
                ))}
              </div>

              {fundingMethod === 'Bank Transfer' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bank name</label>
                    <input
                      type="text"
                      placeholder="e.g. Stanbic Bank Ghana"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account name</label>
                    <input
                      type="text"
                      placeholder="Name on bank account"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account number</label>
                    <input
                      type="text"
                      placeholder="e.g. 9040001234567"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bank branch</label>
                    <input
                      type="text"
                      placeholder="e.g. Airport City Branch"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                      className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border-t border-slate-100 pt-5 mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Money network</label>
                      <select
                        value={momoNetwork}
                        onChange={(e) => setMomoNetwork(e.target.value)}
                        className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"
                      >
                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                        <option value="Telecel Cash">Telecel Cash</option>
                        <option value="AT Money">AT Money</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Wallet type</label>
                      <select
                        value={momoWalletType}
                        onChange={(e) => setMomoWalletType(e.target.value)}
                        className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"
                      >
                        <option value="Subscriber / Personal">Subscriber / Personal</option>
                        <option value="Merchant / Corporate">Merchant / Corporate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Money number</label>
                      <input
                        type="tel"
                        placeholder="e.g. 0244123456"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Registered subscriber name</label>
                      <input
                        type="text"
                        placeholder="Name registered on SIM / Ghana Card"
                        value={momoAccountName}
                        onChange={(e) => setMomoAccountName(e.target.value)}
                        className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white"
                      />
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200/60 rounded-md p-3 text-xs text-amber-900 leading-relaxed">
                    <strong>Important notice:</strong> Under Bank of Ghana KYC regulations, the Mobile Money wallet must be registered in the account holder’s name matching your national ID / Ghana Card.
                  </div>
                </div>
              )}
              <div className="border-t border-slate-100 pt-5 mt-2"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Supporting documents</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><label className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-600 cursor-pointer hover:bg-slate-50">National ID / passport<input type="file" className="sr-only" accept="image/*,.pdf" /></label><label className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-600 cursor-pointer hover:bg-slate-50">Proof of address<input type="file" className="sr-only" accept="image/*,.pdf" /></label><label className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-600 cursor-pointer hover:bg-slate-50">Passport photo / mandate<input type="file" className="sr-only" accept="image/*,.pdf" /></label></div><p className="mt-2 text-xs text-slate-500">Institutional and scheme applications may also require registration documents, board resolutions, trust deeds or fund rules.</p></div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Review & Complete</h2>
              <div className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50">
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Personal Info</span>
                  <p className="text-sm text-slate-900 mt-1">{firstName || 'Client'} {lastName}, {email || 'Email not provided'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Account Type</span>
                  <p className="text-sm text-slate-900 mt-1">{accountType}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Goal &amp; Horizon</span>
                  <p className="text-sm text-slate-900 mt-1">{investmentGoal} · {timeHorizon}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Initial Investment</span>
                  <p className="text-sm text-slate-900 mt-1 font-mono">GH₵ {Number(initialAmount || 0).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Risk Profile</span>
                  <p className="text-sm text-slate-900 mt-1 capitalize">{riskProfile}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase">Funding Details</span>
                  {fundingMethod === 'Bank Transfer' ? (
                    <p className="text-sm text-slate-900 mt-1">
                      Bank Transfer {bankName ? `· ${bankName}` : ''} {bankAccountNumber ? `(${bankAccountNumber})` : ''} {bankAccountName ? `· ${bankAccountName}` : ''}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-900 mt-1">
                      {momoNetwork} {momoNumber ? `(${momoNumber})` : ''} {momoAccountName ? `· ${momoAccountName}` : ''} {momoWalletType ? `[${momoWalletType}]` : ''}
                    </p>
                  )}
                </div>
                <div><span className="text-xs text-slate-500 font-medium uppercase">Portfolio service</span><p className="text-sm text-slate-900 mt-1">{managementStyle} · {statementDelivery}, {statementFrequency}</p></div>
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
