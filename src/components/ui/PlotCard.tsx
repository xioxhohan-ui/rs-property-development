'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Maximize2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './PlotCard.module.css';

interface PlotCardProps {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  size: string;
  type: string;
  verified: boolean;
  image: string;
}

export const PlotCard: React.FC<PlotCardProps> = ({
  slug,
  title,
  location,
  price,
  size,
  type,
  verified,
  image,
}) => {
  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/plots/${slug}`} className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          <Image
            src={image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'}
            alt={title || 'Property'}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className={styles.badges}>
          <span className={styles.badgeType}>{type}</span>
          {verified && (
            <span className={styles.badgeVerified}>
              <ShieldCheck size={14} /> Verified
            </span>
          )}
        </div>
      </Link>
      
      <div className={styles.content}>
        <div className={styles.price}>{price}</div>
        <Link href={`/plots/${slug}`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>
        
        <div className={styles.location}>
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Maximize2 size={16} />
            <span>{size}</span>
          </div>
        </div>
        
        <div className={styles.footer}>
          <Link href={`/plots/${slug}`} className={styles.viewBtn}>
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
