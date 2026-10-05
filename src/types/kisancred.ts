export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type CreditStatus =
  | 'pending_fpo_verification'
  | 'under_underwriting'
  | 'approved'
  | 'disbursed'
  | 'repaid'
  | 'rejected';

export type CropSeason = 'Kharif' | 'Rabi' | 'Zaid';

export type UserRole = 'farmer' | 'fpo_officer' | 'bank_lender' | 'admin';

export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  village: string;
  district: string;
  state: string;
  landSizeAcres: number;
  farmingExperienceYears: number;
  creditScore: number;
  kycVerified: boolean;
  activeLoanAmount: number;
  createdAt: string;
}

export interface AgriculturalRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  cropType: string;
  season: CropSeason;
  year: number;
  productionQuantityQuintals: number;
  grossIncome: number;
  status: VerificationStatus;
  verifiedByOfficer?: string;
  verificationDate?: string;
  verificationNotes?: string;
  geoCoordinates?: string;
  soilHealthIndex?: string;
  createdAt: string;
}

export interface CreditApplication {
  id: string;
  farmerId: string;
  farmerName: string;
  amountRequested: number;
  amountApproved: number;
  purpose: string;
  status: CreditStatus;
  interestRate: number; // e.g. 4.0%
  repaymentTermsMonths: number;
  repaymentStructure: 'bullet_post_harvest' | 'monthly_installments' | 'seasonal_tranches';
  disbursementDate?: string;
  dueDate?: string;
  verifiedYieldValuation: number;
  appliedDate: string;
  notes?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  fpoOrganization?: string;
  badgeNumber?: string;
}

export type ActiveTab =
  | 'overview'
  | 'farmers'
  | 'verifications'
  | 'credits'
  | 'calculator'
  | 'api_docs'
  | 'architecture';
