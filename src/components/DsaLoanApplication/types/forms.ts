import { LoanType } from '../types';
export type { LoanType };

export interface FormErrors {
  [key: string]: string;
}

export interface BaseFormData {
  mobileNumber: string;
  dateOfBirth: string;
  currentCity: string;
  loanAmount: string;
  loanTenure: string;
}

export interface HomeLoanFormData extends BaseFormData {
  fullName: string;
  propertyType: string;
  propertyLocation: string;
  constructionStage: string;
}

export interface EducationLoanFormData extends BaseFormData {
  studentName: string;
  courseName: string;
  instituteName: string;
  courseCountry: string;
  courseDuration: string;
}

export interface FormConfig {
  apiEndpoint: string;
  minLoanAmount: number;
  maxLoanTenure: number;
  minLoanTenure: number;
}

export const FORM_CONFIG: Record<LoanType, FormConfig> = {
  home: {
    apiEndpoint: 'https://n8n-new.uat.refyne.co.in/webhook/homeLoanLeads',
    minLoanAmount: 1000000,
    maxLoanTenure: 30,
    minLoanTenure: 10
  },
  education: {
    apiEndpoint: 'https://n8n-new.uat.refyne.co.in/webhook/educationLoanLeads',
    minLoanAmount: 1000000,
    maxLoanTenure: 12,
    minLoanTenure: 3
  }
};
