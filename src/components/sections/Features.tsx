'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Map, HeadphonesIcon } from 'lucide-react';
import styles from './Features.module.css';

const features = [
  {
    icon: <ShieldCheck size={32} />,
    title: 'Verified Listings',
    description: 'Every property goes through a rigorous verification process to ensure authenticity.'
  },
  {
    icon: <CreditCard size={32} />,
    title: 'Secure Transactions',
    description: 'Our legal team ensures that your transactions are safe, transparent, and legally binding.'
  },
  {
    icon: <Map size={32} />,
    title: 'Premium Locations',
    description: 'Discover the most sought-after and high-value locations across Bangladesh.'
  },
  {
    icon: <HeadphonesIcon size={32} />,
    title: '24/7 Support',
    description: 'Dedicated customer support available around the clock for all your inquiries.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const Features = () => {
  return (
    <section className={styles.section}>
      <div className={`container`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Why Choose RS Property?</h2>
          <p className={styles.subtitle}>
            We provide a premium real estate experience with unmatched security and professionalism.
          </p>
        </div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
