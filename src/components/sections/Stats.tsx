'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Counter } from '@/components/animations/Counter';
import styles from './Stats.module.css';

const stats = [
  { value: 10000, suffix: '+', label: 'Properties' },
  { value: 5000, suffix: '+', label: 'Clients' },
  { value: 64, suffix: '', label: 'District Coverage' },
  { value: 98, suffix: '%', label: 'Satisfaction' },
];

export const Stats = () => {
  return (
    <section className={styles.section}>
      <div className={`container`}>
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className={styles.statItem}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.value}>
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className={styles.label}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
