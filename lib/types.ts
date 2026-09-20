// ─── Auth & User ───────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  name?: string;
  accountNumber: string;
  accountType: "individual" | "joint" | "corporate" | "institutional";
  riskProfile: "conservative" | "moderate" | "balanced" | "growth";
  phone: string;
  address: string;
  city: string;
  country: string;
  kycStatus: "pending" | "verified" | "expired";
  joinDate: string;
  advisor: Advisor;
  bankAccounts: BankAccount[];
  momoAccounts: MomoAccount[];
  beneficiaries?: Beneficiary[];
}

export interface Advisor {
  name: string;
  role: string;
  email: string;
  phone: string;
  imageUrl?: string;
}

export interface BankAccount {
  id: string;
  bank: string;
  accountNumber: string;
  branch: string;
  primary: boolean;
}

export interface MomoAccount {
  id: string;
  network: "MTN" | "Telecel" | "AT";
  number: string;
  name: string;
}

export interface Beneficiary {
  name: string;
  relationship: string;
  phone: string;
  percentage: number;
}

// ─── Funds ─────────────────────────────────────────────────
export interface Fund {
  id: string;
  name: string;
  shortName: string;
  type: string;
  assetClass?: string;
  riskLevel: "Low" | "Low to Medium" | "Medium" | "Medium to High" | "High";
  objective: string;
  nav: number;
  navDate: string;
  dailyChange: number;
  dailyChangePercent: number;
  ytdReturn: number;
  sinceInception: number;
  fundSize: number;
  minimumInvestment: number;
  minInvestment?: number;
  managementFee: number;
  benchmark: string;
  inceptionDate: string;
  composition: FundComposition[];
  color: string;
  documents: FundDocument[];
}

export interface FundComposition {
  name: string;
  assetClass?: string;
  percentage: number;
}

export interface FundDocument {
  name: string;
  title?: string;
  type: "prospectus" | "factsheet" | "annual_report" | "terms";
  date: string;
}

// ─── Portfolio ─────────────────────────────────────────────
export interface Holding {
  fundId: string;
  fundName?: string;
  units: number;
  averageCost: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  allocation: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGain: number;
  gainPercent: number;
  ytdReturn: number;
  dayChange: number;
  dayChangePercent: number;
  lastUpdated: string;
}

export interface PortfolioData {
  userId: string;
  summary: PortfolioSummary;
  holdings: Holding[];
}

// ─── Transactions ──────────────────────────────────────────
export type TransactionType =
  | "investment"
  | "withdrawal"
  | "switch"
  | "switch_in"
  | "switch_out"
  | "dividend"
  | "fee";

export type TransactionStatus =
  | "completed"
  | "processing"
  | "pending"
  | "failed";

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  type: TransactionType;
  fundId: string;
  fundName: string;
  amount: number;
  units: number;
  nav: number;
  status: TransactionStatus;
  reference: string;
  description: string;
  paymentMethod?: string;
  relatedTransactionId?: string;
}

// ─── Statements ────────────────────────────────────────────
export type StatementPeriod = "monthly" | "quarterly" | "annual" | "confirmation" | "factsheet";

export interface Statement {
  id: string;
  userId: string;
  name: string;
  period: StatementPeriod;
  periodLabel: string;
  generatedDate: string;
  date?: string;
  fileType: "PDF";
  downloadUrl: string;
  type?: string;
}

// ─── Notifications ─────────────────────────────────────────
export type NotificationType =
  | "investment"
  | "withdrawal"
  | "statement"
  | "price"
  | "security"
  | "system";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
}

// ─── Chart Data ────────────────────────────────────────────
export type Timeframe = "1M" | "3M" | "6M" | "1Y" | "3Y" | "ALL";

export interface ChartDataPoint {
  date: string;
  portfolio: number;
  benchmark: number;
  tbill: number;
  invested: number;
}

// ─── Calculator ────────────────────────────────────────────
export interface CalculatorInputs {
  initialInvestment: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number;
}

export interface CalculatorResult {
  year: number;
  label: string;
  contributions: number;
  growth: number;
  total: number;
}

// ─── Toast ─────────────────────────────────────────────────
export interface Toast {
  id: string;
  message: string;
  title?: string;
  type: "success" | "info" | "error";
}

// ─── Session ───────────────────────────────────────────────
export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  accountType: string;
  loginTime: string;
  isDemo: boolean;
}

// ─── Onboarding ────────────────────────────────────────────
export interface OnboardingData {
  step: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    ghanaCardNumber: string;
  };
  accountType: "individual" | "joint" | "corporate" | "institutional";
  investmentPreferences: {
    investmentGoal: string;
    timeHorizon: string;
    initialAmount: number;
  };
  riskProfile: "conservative" | "moderate" | "balanced" | "growth";
  fundingMethod: "bank_transfer" | "mobile_money";
}

export interface OnboardingApplication {
  id: string;
  reference: string;
  submittedAt: string;
  status: "pending_review" | "approved" | "rejected" | "info_requested";
  accountCategory: "Individual" | "Joint Account" | "Institution" | "Collective Investment Scheme";
  applicantName: string;
  email: string;
  phone: string;
  riskProfile: "conservative" | "moderate" | "balanced" | "growth";
  managementStyle: string;
  fundingMethod: "Bank Transfer" | "Mobile Money";
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  momoNetwork?: string;
  momoAccountName?: string;
  momoNumber?: string;
  momoWalletType?: string;
  sourceOfFunds?: string;
  investmentGoal?: string;
  timeHorizon?: string;
  initialAmount?: number;
  statementDelivery?: string;
  statementFrequency?: string;
  documents: {
    nationalId: boolean;
    proofOfAddress: boolean;
    passportOrMandate: boolean;
    institutionalResolution?: boolean;
  };
  complianceNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

