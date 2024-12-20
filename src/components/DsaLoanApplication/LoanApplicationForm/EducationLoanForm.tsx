import { useState, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from 'phosphor-react';
import { validateBaseFormData } from '../utils/validation';
import { EducationLoanFormData, FormErrors, FORM_CONFIG } from '../types/forms';
import styles from './styles.module.css';

export default function EducationLoanForm() {
  const [formData, setFormData] = useState<EducationLoanFormData>({
    studentName: '',
    dateOfBirth: '',
    mobileNumber: '',
    currentCity: '',
    courseName: '',
    instituteName: '',
    courseCountry: '',
    courseDuration: '',
    loanAmount: '',
    loanTenure: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const config = FORM_CONFIG['education'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    const dob = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - dob.getFullYear();

    if (!formData.studentName) newErrors.studentName = 'Student name is required';
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (age < 18) {
      newErrors.dateOfBirth = 'Must be at least 18 years old';
    }
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Must be 10 digits';
    }
    if (!formData.currentCity) newErrors.currentCity = 'Current city is required';
    if (!formData.courseName) newErrors.courseName = 'Course name is required';
    if (!formData.instituteName) newErrors.instituteName = 'Institute name is required';
    if (!formData.courseCountry) newErrors.courseCountry = 'Course country is required';
    if (!formData.courseDuration) newErrors.courseDuration = 'Course duration is required';
    if (!formData.loanAmount) {
      newErrors.loanAmount = 'Loan amount is required';
    } else if (Number(formData.loanAmount) < config.minLoanAmount) {
      newErrors.loanAmount = `Minimum loan amount is ₹${config.minLoanAmount.toLocaleString()}`;
    }
    if (!formData.loanTenure) newErrors.loanTenure = 'Loan tenure is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch(FORM_CONFIG.education.apiEndpoint, {
          method: 'POST',
          mode: 'cors',
          redirect: 'follow',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('Success:', data);
        router.push('/dsa-loan-journey/loan-application/thank-you?type=education');
      } catch (error) {
        console.error('Error:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to submit application. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
       
    if (name === 'mobileNumber') {
      const numericValue = value.replace(/\D/g, '');
  
      setFormData(prev => ({ ...prev, [name]: numericValue }));
  
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Student Information</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="studentName">Student Name</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            className={styles.input}
            value={formData.studentName}
            onChange={handleChange}
          />
          {errors.studentName && <span className={styles.error}>{errors.studentName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            className={`${styles.input} ${styles.dateInput}`}
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dateOfBirth && <span className={styles.error}>{errors.dateOfBirth}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            className={styles.input}
            value={formData.mobileNumber}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
          />
          {errors.mobileNumber && <span className={styles.error}>{errors.mobileNumber}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="currentCity">Current City of Residence</label>
          <input
            type="text"
            id="currentCity"
            name="currentCity"
            className={styles.input}
            value={formData.currentCity}
            onChange={handleChange}
          />
          {errors.currentCity && <span className={styles.error}>{errors.currentCity}</span>}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Education Details</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="courseName">Course Name</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            className={styles.input}
            value={formData.courseName}
            onChange={handleChange}
          />
          {errors.courseName && <span className={styles.error}>{errors.courseName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="instituteName">Institute Name</label>
          <input
            type="text"
            id="instituteName"
            name="instituteName"
            className={styles.input}
            value={formData.instituteName}
            onChange={handleChange}
          />
          {errors.instituteName && <span className={styles.error}>{errors.instituteName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="courseCountry">Course Country</label>
          <input
            type="text"
            id="courseCountry"
            name="courseCountry"
            className={styles.input}
            value={formData.courseCountry}
            onChange={handleChange}
          />
          {errors.courseCountry && <span className={styles.error}>{errors.courseCountry}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="courseDuration">Course Duration (Years)</label>
          <select
            id="courseDuration"
            name="courseDuration"
            className={styles.select}
            value={formData.courseDuration}
            onChange={handleChange}
          >
            <option value="">Select Duration</option>
            {[1, 2, 3, 4, 5].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.courseDuration && <span className={styles.error}>{errors.courseDuration}</span>}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Loan Requirements</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="loanAmount">Estimated Loan Amount (₹)</label>
          <input
            type="number"
            id="loanAmount"
            name="loanAmount"
            className={styles.input}
            value={formData.loanAmount}
            onChange={handleChange}
          />
          {errors.loanAmount && <span className={styles.error}>{errors.loanAmount}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="loanTenure">Preferred Loan Tenure (Years)</label>
          <select
            id="loanTenure"
            name="loanTenure"
            className={styles.select}
            value={formData.loanTenure}
            onChange={handleChange}
          >
            <option value="">Select Loan Tenure</option>
            {Array.from({ length: 10 }, (_, i) => i + 3).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.loanTenure && <span className={styles.error}>{errors.loanTenure}</span>}
        </div>
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className={styles.spinnerContainer}>
            <Spinner size={20} className={styles.spinner} /> 
            Submitting...
          </span>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  );
}
