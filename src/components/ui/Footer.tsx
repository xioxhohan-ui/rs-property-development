import React from 'react';
import Link from 'next/link';
import { Building2, Globe, MessageCircle, Briefcase, MapPin, Phone, Mail, PlayCircle } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerCol}>
            <Link href="/" className={styles.logo}>
              <Building2 className={styles.logoIcon} />
              <div className={styles.logoText}>
                <span className={styles.logoPrimary}>RS Property</span>
                <span className={styles.logoSecondary}>Development</span>
              </div>
            </Link>
            <p className={styles.companyDesc}>
              Buy, Sell and Invest in Verified Properties Across Bangladesh. Your trusted partner for luxury real estate.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Website"><Globe size={20} /></a>
              <a href="#" aria-label="Social"><MessageCircle size={20} /></a>
              <a href="#" aria-label="Business"><Briefcase size={20} /></a>
              <a href="#" aria-label="Media"><PlayCircle size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerCol}>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/plots">Browse Plots</Link></li>
              <li><Link href="/map">Interactive Map</Link></li>
              <li><Link href="/become-a-seller">Become A Seller</Link></li>
              <li><Link href="/blog">Real Estate Blog</Link></li>
            </ul>
          </div>

          {/* Latest Properties */}
          <div className={styles.footerCol}>
            <h3 className={styles.colTitle}>Top Districts</h3>
            <ul className={styles.linkList}>
              <li><Link href="/plots?district=Dhaka">Dhaka Properties</Link></li>
              <li><Link href="/plots?district=Chattogram">Chattogram Properties</Link></li>
              <li><Link href="/plots?district=Sylhet">Sylhet Properties</Link></li>
              <li><Link href="/plots?district=Rajshahi">Rajshahi Properties</Link></li>
              <li><Link href="/plots?district=Khulna">Khulna Properties</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerCol}>
            <h3 className={styles.colTitle}>Contact Us</h3>
            <ul className={styles.contactList}>
              <li>
                <MapPin size={18} className={styles.contactIcon} />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li>
                <Phone size={18} className={styles.contactIcon} />
                <span>+880 1814963730</span>
              </li>
              <li>
                <Mail size={18} className={styles.contactIcon} />
                <span>info@rsproperty.com.bd</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} RS Property Development. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
