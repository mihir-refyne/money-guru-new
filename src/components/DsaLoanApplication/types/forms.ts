import { LoanType } from '../types';

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
    apiEndpoint: 'https://script.google.com/a/macros/refyne.co.in/s/AKfycbzO0tAuy2RYdsTNb1Q6ShnEZ-S31MF63x4gOmfrnXdghLUVvMHDlEoHYcWw0dCZHWx2/exec',
    minLoanAmount: 1000000,
    maxLoanTenure: 30,
    minLoanTenure: 10
  },
  education: {
    apiEndpoint: 'https://script.google.com/a/macros/refyne.co.in/s/AKfycbzQqCEZmG0DcOBL9p9Wd8T3WnqwjAS09Af2qCtj2YOuUQidwos7PMOWplfKROzRpX8a/exec',
    minLoanAmount: 1000000,
    maxLoanTenure: 12,
    minLoanTenure: 3
  }
};
