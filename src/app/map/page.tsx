'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './Map.module.css';

const districts = [
  { id: 'dhaka', name: 'Dhaka', properties: 1250 },
  { id: 'chattogram', name: 'Chattogram', properties: 840 },
  { id: 'sylhet', name: 'Sylhet', properties: 420 },
  { id: 'rajshahi', name: 'Rajshahi', properties: 310 },
  { id: 'khulna', name: 'Khulna', properties: 280 },
  { id: 'gazipur', name: 'Gazipur', properties: 650 },
  { id: 'narayanganj', name: 'Narayanganj', properties: 480 },
  { id: 'barishal', name: 'Barishal', properties: 150 },
  { id: 'rangpur', name: 'Rangpur', properties: 120 },
  { id: 'mymensingh', name: 'Mymensingh', properties: 180 },
];

export default function MapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Interactive Property Map</h1>
          <p className={styles.subtitle}>Explore properties across 64 districts of Bangladesh</p>
        </div>
      </div>
      
      <div className={`container ${styles.content}`}>
        <div className={styles.sidebar}>
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search district..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.districtList}>
            {filteredDistricts.map(district => (
              <button 
                key={district.id}
                className={`${styles.districtItem} ${selectedDistrict === district.id ? styles.active : ''}`}
                onClick={() => setSelectedDistrict(district.id)}
              >
                <div className={styles.districtInfo}>
                  <span className={styles.districtName}>{district.name}</span>
                  <span className={styles.districtProps}>{district.properties} Properties</span>
                </div>
              </button>
            ))}
          </div>
          
          {selectedDistrict && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.actionCard}
            >
              <h3>Explore {districts.find(d => d.id === selectedDistrict)?.name}</h3>
              <p>Find the best residential and commercial plots in this district.</p>
              <Link href={`/plots?district=${selectedDistrict}`}>
                <Button variant="primary" fullWidth>View Properties</Button>
              </Link>
            </motion.div>
          )}
        </div>
        
        <div className={styles.mapContainer}>
          <iframe 
            className={styles.iframe}
            src={`https://maps.google.com/maps?q=${selectedDistrict ? `${districts.find(d => d.id === selectedDistrict)?.name}, Bangladesh` : 'Bangladesh'}&t=&z=${selectedDistrict ? 10 : 7}&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Interactive Property Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
