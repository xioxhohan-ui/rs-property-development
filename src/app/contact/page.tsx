'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './Contact.module.css';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert('Thank you for contacting us. We will get back to you shortly.');
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>Have a question about a property or need assistance? Our expert team is here to help you.</p>
        </div>
      </div>
      
      <div className={`container ${styles.content}`}>
        <div className={styles.grid}>
          {/* Contact Information */}
          <div className={styles.infoSection}>
            <h2>Contact Information</h2>
            <p className={styles.infoDesc}>Reach out to us directly through any of the following channels. We aim to respond to all inquiries within 24 hours.</p>
            
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <Phone size={24} />
                </div>
                <div>
                  <h3>Phone</h3>
                  <p>+880 1814963730 (Shakil Hossain Rifat)</p>
                  <p>+880 1712053941 (Mr. Roni)</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3>WhatsApp</h3>
                  <p>+880 1814963730 (Shakil Hossain Rifat)</p>
                  <p>+880 1712053941 (Mr. Roni)</p>
                  <Button variant="outline" size="sm" className={styles.actionBtn}>Chat on WhatsApp</Button>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <Mail size={24} />
                </div>
                <div>
                  <h3>Email</h3>
                  <p>info@rsproperty.com.bd</p>
                  <p>sales@rsproperty.com.bd</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3>Office Address</h3>
                  <p>Level 12, Premium Tower</p>
                  <p>Gulshan Avenue, Dhaka 1212</p>
                  <p>Bangladesh</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <Clock size={24} />
                </div>
                <div>
                  <h3>Business Hours</h3>
                  <p>Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                  <p>Friday - Saturday: Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className={styles.formSection}>
            <div className={styles.formCard}>
              <h2>Send a Message</h2>
              <p>Fill out the form below and we will contact you as soon as possible.</p>
              
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <input type="text" placeholder="John" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input type="text" placeholder="Doe" required />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+880 1XXXXXXXXX" required />
                  </div>
                </div>
                
                <div className={styles.formGroupFull}>
                  <label>Subject</label>
                  <select required>
                    <option value="">Select a topic</option>
                    <option value="buy">I want to buy a property</option>
                    <option value="sell">I want to sell my property</option>
                    <option value="investment">Investment Opportunities</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>
                
                <div className={styles.formGroupFull}>
                  <label>Message</label>
                  <textarea rows={6} placeholder="How can we help you?" required></textarea>
                </div>
                
                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className={styles.mapSection}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapContent}>
            <MapPin size={48} className={styles.mapPin} />
            <h2>Find Us in Dhaka</h2>
            <p>Interactive Google Maps integration will be placed here.</p>
            <Button variant="primary">Get Directions</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
