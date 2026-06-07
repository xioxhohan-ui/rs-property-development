'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import styles from './Hero.module.css';

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.container}`}>
        <div className={styles.splitLayout}>
          {/* Text Content */}
          <motion.div 
            className={styles.content}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find Your Perfect Land Anywhere In <span className="text-accent" style={{ color: 'var(--bold-blue)' }}>Bangladesh</span>
            </motion.h1>
            
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Buy, Sell and Invest in Verified Properties Across Bangladesh. Experience the luxury of a seamless real estate journey.
            </motion.p>
            
            <motion.div 
              className={styles.buttons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/plots">
                <Button variant="primary" size="lg">Browse Plots</Button>
              </Link>
              <Link href="/sell">
                <Button variant="secondary" size="lg">Sell Property</Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            className={styles.imageContainer}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
          >
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className={styles.floatingImageWrapper}
            >
              <img 
                src="/home.png" 
                alt="Floating Luxury Property" 
                className={styles.heroImage}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
