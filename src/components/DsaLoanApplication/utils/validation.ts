import { FormErrors, BaseFormData, FORM_CONFIG, LoanType } from '../types/forms';

export const validateBaseFormData = (
  data: BaseFormData,
  loanType: LoanType,
  errors: FormErrors = {}
): FormErrors => {
  const today = new Date();
  const dob = new Date(data.dateOfBirth);
  const age = today.getFullYear() - dob.getFullYear();
  const config = FORM_CONFIG[loanType];

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else if (age < 18) {
    errors.dateOfBirth = 'Must be at least 18 years old';
  }

  if (!data.mobileNumber) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(data.mobileNumber)) {
    errors.mobileNumber = 'Must be 10 digits';
  }

  if (!data.currentCity) {
    errors.currentCity = 'Current city is required';
  }

  if (!data.loanAmount) {
    errors.loanAmount = 'Loan amount is required';
  } else if (Number(data.loanAmount) < config.minLoanAmount) {
    errors.loanAmount = `Minimum loan amount is ₹${config.minLoanAmount.toLocaleString()}`;
  }

  if (!data.loanTenure) {
    errors.loanTenure = 'Loan tenure is required';
  }

  return errors;
};
