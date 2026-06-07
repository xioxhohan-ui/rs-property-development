import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2, Globe, MessageCircle, Link2 } from 'lucide-react';
import styles from './BlogDetail.module.css';

import { db } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getBlogPost(slug: string) {
  try {
    const snapshot = await db.collection('blogs').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) {
      return null;
    }
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) notFound();

  const post = await getBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className={styles.page}>
      {/* Hero Image */}
      <div className={styles.heroImageContainer}>
        <Image src={post.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'} alt={post.title || 'Blog Post'} fill className={styles.heroImage} priority />
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <Link href="/blog" className={styles.backBtn}>
            <ArrowLeft size={20} /> Back to Blog
          </Link>
          <div className={styles.badge}>{post.category || 'Blog'}</div>
          <h1 className={styles.title}>{post.title || 'Untitled'}</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}><Calendar size={16} /> {post.date || new Date().toISOString().split('T')[0]}</span>
            <span className={styles.metaItem}><User size={16} /> {post.author || 'Admin'}</span>
          </div>
        </div>
      </div>
      
      <div className={`container ${styles.mainContent}`}>
        <div className={styles.grid}>
          {/* Article Content */}
          <article className={styles.article}>
            <div 
              className={styles.prose} 
              dangerouslySetInnerHTML={{ __html: post.content || '' }} 
            />
            
            <div className={styles.tags}>
              <span>Real Estate</span>
              <span>Investment</span>
              <span>Guide</span>
              <span>Bangladesh</span>
            </div>
            
            <div className={styles.shareSection}>
              <h3>Share this article:</h3>
              <div className={styles.shareButtons}>
                <button aria-label="Share via Web"><Globe size={20} /></button>
                <button aria-label="Share via Social"><MessageCircle size={20} /></button>
                <button aria-label="Copy Link"><Link2 size={20} /></button>
                <button aria-label="Share"><Share2 size={20} /></button>
              </div>
            </div>
          </article>
          
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>Popular Posts</h3>
              <ul className={styles.popularPosts}>
                <li>
                  <Link href="/blog/understanding-land-mutation">
                    <div className={styles.popularImg}>
                      <Image src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Post" fill className={styles.img} />
                    </div>
                    <div className={styles.popularContent}>
                      <h4>Understanding Land Mutation (Namjari)</h4>
                      <span>June 2, 2026</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/top-investment-areas-dhaka-2026">
                    <div className={styles.popularImg}>
                      <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Post" fill className={styles.img} />
                    </div>
                    <div className={styles.popularContent}>
                      <h4>Top 5 Areas for Real Estate Investment</h4>
                      <span>May 28, 2026</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>Categories</h3>
              <ul className={styles.categoryList}>
                <li><Link href="#">Land Buying Guide <span>(12)</span></Link></li>
                <li><Link href="#">Property Investment <span>(8)</span></Link></li>
                <li><Link href="#">Legal Information <span>(15)</span></Link></li>
                <li><Link href="#">Property Trends <span>(6)</span></Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
