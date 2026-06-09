'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import styles from './Hero.module.css';

export const Hero = () => {
  return (
    <section className={styles.hero}>
      {/* Decorative 2D Background Elements (Zero Lag) */}
      <div className={styles.bgDecorations}>
        <motion.div 
          className={`${styles.decorObject} ${styles.decor1}`}
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div 
          className={`${styles.decorObject} ${styles.decor2}`}
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className={`${styles.decorObject} ${styles.decor3}`}
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
        />
        {/* New Small Objects */}
        <motion.div 
          className={`${styles.decorObject} ${styles.decor4}`}
          animate={{ y: [0, -30, 0], x: [0, 10, 0], rotate: [0, 45, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className={`${styles.decorObject} ${styles.decor5}`}
          animate={{ y: [0, 20, 0], x: [0, -15, 0], rotate: [0, -45, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 3 }}
        />
        <motion.div 
          className={`${styles.decorObject} ${styles.decor6}`}
          animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div 
          className={`${styles.decorObject} ${styles.decor7}`}
          animate={{ y: [0, 25, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 4 }}
        />
      </div>

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
              <Link href="/browse">
                <Button variant="primary" size="lg">Browse</Button>
              </Link>
              <Link href="/become-a-seller">
                <Button variant="secondary" size="lg">Become A Seller</Button>
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
            <div className={styles.floatingImageWrapper}>
              <img 
                src="/home.png" 
                alt="Floating Luxury Property" 
                className={styles.heroImage}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
