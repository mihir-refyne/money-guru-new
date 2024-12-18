import { useState } from 'react';
import { LoanType } from '../types';
import styles from './styles.module.css';
import HomeLoanForm from './HomeLoanForm';
import EducationLoanForm from './EducationLoanForm';

interface LoanApplicationFormProps {
  loanType: LoanType;
}

export default function LoanApplicationForm({ loanType }: LoanApplicationFormProps) {
  const FormComponent = loanType === 'home' ? HomeLoanForm : EducationLoanForm;
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {loanType === 'home' ? 'Home Loan Application' : 'Education Loan Application'}
      </h1>
      <FormComponent />
    </div>
  );
}
