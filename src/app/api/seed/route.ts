import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

const allPlots = [
  {
    id: '1',
    slug: 'purbachal-sector-12-residential',
    title: 'Premium Residential Plot in Purbachal Sector 12',
    location: 'Purbachal, Dhaka',
    price: '৳ 1.5 Crore',
    size: '5 Katha',
    type: 'Residential',
    verified: true,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1032&q=80',
    facilities: ['Water Supply', 'Electricity', 'Gas Line', 'Boundary Wall', 'Wide Road'],
    district: 'dhaka'
  },
  {
    id: '2',
    slug: 'basundhara-commercial-block-c',
    title: 'Commercial Land in Bashundhara Block C',
    location: 'Bashundhara R/A, Dhaka',
    price: '৳ 5.2 Crore',
    size: '10 Katha',
    type: 'Commercial',
    verified: true,
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1165&q=80',
    facilities: ['Water Supply', 'Electricity', 'Gas Line', 'Main Road Access', 'Security'],
    district: 'dhaka'
  },
  {
    id: '3',
    slug: 'savar-agricultural-land',
    title: 'Fertile Agricultural Land in Savar',
    location: 'Savar, Dhaka',
    price: '৳ 80 Lakh',
    size: '1 Bigha',
    type: 'Agricultural',
    verified: false,
    image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80',
    facilities: ['Water Supply', 'Irrigation System', 'Road Access'],
    district: 'dhaka'
  },
  {
    id: '4',
    slug: 'chattogram-sea-view-plot',
    title: 'Sea View Residential Plot',
    location: 'Foy\'s Lake, Chattogram',
    price: '৳ 2.1 Crore',
    size: '6 Katha',
    type: 'Residential',
    verified: true,
    image: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    facilities: ['Water Supply', 'Electricity', 'Scenic View', 'Boundary Wall'],
    district: 'chattogram'
  },
  {
    id: '5',
    slug: 'sylhet-tea-garden-adjacent',
    title: 'Scenic Plot Adjacent to Tea Garden',
    location: 'Sreemangal, Sylhet',
    price: '৳ 90 Lakh',
    size: '10 Katha',
    type: 'Residential',
    verified: true,
    image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    facilities: ['Water Supply', 'Electricity', 'Peaceful Environment'],
    district: 'sylhet'
  },
  {
    id: '6',
    slug: 'gazipur-industrial-land',
    title: 'Prime Industrial Land near Highway',
    location: 'Tongi, Gazipur',
    price: '৳ 10 Crore',
    size: '5 Bigha',
    type: 'Commercial',
    verified: true,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    facilities: ['Water Supply', 'Heavy Electricity', 'Gas Line', 'Highway Access'],
    district: 'gazipur'
  }
];

const blogPosts = [
  {
    id: '1',
    slug: 'guide-to-buying-land-in-bangladesh',
    title: 'The Ultimate Guide to Buying Land in Bangladesh',
    excerpt: 'Everything you need to know about purchasing property in Bangladesh, from legal verification to final registration.',
    category: 'Land Buying Guide',
    date: 'June 5, 2026',
    author: 'RS Real Estate Team',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80',
    content: '<h2>Understanding the Landscape</h2><p>Buying land in Bangladesh can be a complex process if you are not familiar with the local laws and regulations. It is essential to conduct proper due diligence before making any commitment.</p><h3>1. Verifying Documents (Khatian & Porcha)</h3><p>The first step in buying any property is to verify the ownership documents. The most crucial documents are the Khatian (Record of Rights) and the Porcha. You must ensure that the sellers name matches the latest CS, RS, and BS Khatian.</p><h3>2. Non-Encumbrance Certificate (NEC)</h3><p>Always obtain an NEC from the sub-registry office. This document proves that the land is free from any legal disputes, mortgages, or pending dues.</p><h3>3. Physical Verification</h3><p>Never buy land without visiting it physically. Measure the land to ensure it matches the area mentioned in the documents. Check the road access and surrounding facilities.</p><h2>The Registration Process</h2><p>Once you are satisfied with the documents and physical verification, the next step is the registration process. This involves paying several fees and taxes, including Stamp Duty, Registration Fee, Local Government Tax, and Capital Gains Tax (usually paid by the seller).</p><blockquote>"A thorough verification process today saves you from years of legal battles tomorrow." - RS Legal Team</blockquote><h2>Conclusion</h2><p>Investing in land is one of the safest and most profitable ventures in Bangladesh, provided you follow the right procedures. At RS Property Development, our legal team ensures that every property listed on our platform is 100% verified and free from any disputes.</p>'
  },
  {
    id: '2',
    slug: 'understanding-land-mutation',
    title: 'Understanding Land Mutation (Namjari) Process',
    excerpt: 'A step-by-step breakdown of the land mutation process and why it is critical for property ownership.',
    category: 'Mutation Guide',
    date: 'June 2, 2026',
    author: 'Advocate R. Islam',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    content: '<p>Content for understanding land mutation...</p>'
  },
  {
    id: '3',
    slug: 'top-investment-areas-dhaka-2026',
    title: 'Top 5 Areas for Real Estate Investment in Dhaka (2026)',
    excerpt: 'Discover the most promising neighborhoods in Dhaka that offer the highest return on investment this year.',
    category: 'Property Investment',
    date: 'May 28, 2026',
    author: 'Investment Desk',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    content: '<p>Content for top investment areas...</p>'
  },
  {
    id: '4',
    slug: 'property-registration-fees',
    title: 'Current Property Registration Fees & Taxes',
    excerpt: 'A comprehensive breakdown of all costs involved in registering a new property in Bangladesh.',
    category: 'Legal Information',
    date: 'May 15, 2026',
    author: 'Financial Team',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1211&q=80',
    content: '<p>Content for property registration fees...</p>'
  }
];

export async function GET() {
  try {
    const batch = db.batch();
    
    // Seed Plots
    const plotsRef = db.collection('plots');
    for (const plot of allPlots) {
      const docRef = plotsRef.doc(plot.id);
      batch.set(docRef, plot);
    }
    
    // Seed Blog Posts
    const postsRef = db.collection('posts');
    for (const post of blogPosts) {
      const docRef = postsRef.doc(post.id);
      batch.set(docRef, post);
    }
    
    await batch.commit();
    
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed database', details: error.message || error.toString() }, { status: 500 });
  }
}
