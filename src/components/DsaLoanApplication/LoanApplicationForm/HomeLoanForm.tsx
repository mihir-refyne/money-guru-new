import { useState, FormEvent, useCallback } from 'react';
import { Spinner } from 'phosphor-react';
import { useRouter } from 'next/router';
import { validateBaseFormData } from '../utils/validation';
import { HomeLoanFormData, FormErrors, FORM_CONFIG } from '../types/forms';
import styles from './styles.module.css';

export default function HomeLoanForm() {
  const [formData, setFormData] = useState<HomeLoanFormData>({
    fullName: '',
    dateOfBirth: '',
    mobileNumber: '',
    currentCity: '',
    propertyType: '',
    propertyLocation: '',
    constructionStage: '',
    loanAmount: '',
    loanTenure: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = validateBaseFormData(formData, 'home');
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required'
    }
    if (!formData.propertyLocation) {
      newErrors.propertyLocation = 'Property location is required'
    }
    if (!formData.constructionStage) {
      newErrors.constructionStage = 'Construction stage is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch(FORM_CONFIG.home.apiEndpoint, {
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
        router.push('/dsa-loan-journey/loan-application/thank-you?type=home');
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
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className={styles.input}
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
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
            pattern="[0-9]{10}"
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
        <h2 className={styles.sectionTitle}>Property Information</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="propertyType">Property Type</label>
          <select
            id="propertyType"
            name="propertyType"
            className={styles.select}
            value={formData.propertyType}
            onChange={handleChange}
          >
            <option value="">Select Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="independent">Independent House</option>
            <option value="plot">Plot</option>
          </select>
          {errors.propertyType && <span className={styles.error}>{errors.propertyType}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="propertyLocation">Property Location</label>
          <input
            type="text"
            id="propertyLocation"
            name="propertyLocation"
            className={styles.input}
            value={formData.propertyLocation}
            onChange={handleChange}
          />
          {errors.propertyLocation && <span className={styles.error}>{errors.propertyLocation}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="constructionStage">Stage of Construction</label>
          <select
            id="constructionStage"
            name="constructionStage"
            className={styles.select}
            value={formData.constructionStage}
            onChange={handleChange}
          >
            <option value="">Select Construction Stage</option>
            <option value="ready">Ready</option>
            <option value="under_construction">Under Construction</option>
          </select>
          {errors.constructionStage && <span className={styles.error}>{errors.constructionStage}</span>}
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
            min="1000000"
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
            {Array.from({ length: 21 }, (_, i) => i + 10).map(year => (
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
      {errors.submit && <span className={styles.error}>{errors.submit}</span>}
    </form>
  );
}
