'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, UploadCloud, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './Sell.module.css';

export default function SellPropertyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className={styles.page}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.successCard}
          >
            <CheckCircle2 size={64} className={styles.successIcon} />
            <h2>Property Submitted Successfully!</h2>
            <p>Our team will review your property and contact you shortly.</p>
            <Button variant="primary" onClick={() => setIsSubmitted(false)}>
              Submit Another Property
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Sell Your Property</h1>
          <p className={styles.subtitle}>List your land, commercial space, or residential property with RS Property Development and reach thousands of buyers across Bangladesh.</p>
        </div>
      </div>
      
      <div className="container py-12">
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Building size={32} className={styles.formIcon} />
            <h2>Property Details</h2>
            <p>Please fill out the information below as accurately as possible.</p>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <h3>1. Personal Information</h3>
              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input type="text" required placeholder="John Doe" />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number *</label>
                  <input type="tel" required placeholder="+880 1XXXXXXXXX" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" />
                </div>
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h3>2. Property Information</h3>
              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label>Property Type *</label>
                  <select required>
                    <option value="">Select Type</option>
                    <option value="residential">Residential Plot</option>
                    <option value="commercial">Commercial Land</option>
                    <option value="agricultural">Agricultural Land</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>District *</label>
                  <select required>
                    <option value="">Select District</option>
                    <option value="dhaka">Dhaka</option>
                    <option value="chattogram">Chattogram</option>
                    <option value="sylhet">Sylhet</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Address *</label>
                  <input type="text" required placeholder="Sector, Block, Area" />
                </div>
                <div className={styles.formGroup}>
                  <label>Land Size *</label>
                  <input type="text" required placeholder="e.g., 5 Katha, 1 Bigha" />
                </div>
                <div className={styles.formGroup}>
                  <label>Expected Price (BDT) *</label>
                  <input type="text" required placeholder="e.g., 1,50,00,000" />
                </div>
              </div>
              
              <div className={styles.formGroupFull}>
                <label>Property Description *</label>
                <textarea required rows={5} placeholder="Describe the property features, nearby amenities, road access, etc."></textarea>
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h3>3. Property Images</h3>
              <div className={styles.uploadArea}>
                <UploadCloud size={48} className={styles.uploadIcon} />
                <p>Drag & drop images here or <strong>browse</strong></p>
                <span className={styles.uploadHint}>Upload up to 10 high-quality images (Max 5MB each)</span>
                <input type="file" multiple className={styles.fileInput} accept="image/*" />
              </div>
            </div>
            
            <div className={styles.submitArea}>
              <Button type="submit" variant="primary" size="lg" fullWidth>
                Submit Property for Review
              </Button>
              <p className={styles.terms}>
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
