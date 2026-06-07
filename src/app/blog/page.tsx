import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import styles from './Blog.module.css';

const categories = [
  'All', 'Land Buying Guide', 'Property Investment', 'Legal Information', 
  'Registration Process', 'Mutation Guide', 'Land Tax Guide', 'Property Trends'
];

import { db } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

async function getBlogPosts() {
  try {
    const snapshot = await db.collection('posts').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Real Estate Insights</h1>
          <p className={styles.subtitle}>Stay updated with the latest news, guides, and trends in the Bangladesh real estate market.</p>
        </div>
      </div>
      
      <div className="container py-12">
        <div className={styles.categoriesWrapper}>
          <div className={styles.categories}>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                className={`${styles.categoryBtn} ${idx === 0 ? styles.active : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.grid}>
          {blogPosts.map((post) => (
            <div key={post.id} className={styles.card}>
              <Link href={`/blog/${post.slug}`} className={styles.imageWrapper}>
                <Image src={post.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'} alt={post.title || 'Blog Post'} fill className={styles.image} />
                <span className={styles.categoryBadge}>{post.category}</span>
              </Link>
              
              <div className={styles.content}>
                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <Calendar size={14} /> {post.date}
                  </span>
                  <span className={styles.metaItem}>
                    <User size={14} /> {post.author}
                  </span>
                </div>
                
                <Link href={`/blog/${post.slug}`}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                </Link>
                
                <p className={styles.excerpt}>{post.excerpt}</p>
                
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
