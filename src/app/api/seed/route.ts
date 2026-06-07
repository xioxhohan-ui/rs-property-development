import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

const seedData = {
  properties: [
    {
      id: 'prop-1',
      slug: 'luxury-apartment-bashundhara',
      title: 'Luxury Apartment in Bashundhara',
      category: 'Property',
      district: 'Dhaka',
      area: 'Bashundhara R/A',
      address: 'Block C, Road 5',
      price: '৳ 3.5 Crore',
      size: '2500 sqft',
      bedrooms: 4,
      bathrooms: 4,
      garage: 2,
      status: 'Available',
      description: 'A stunning luxury apartment featuring modern glassmorphism design, open concept living spaces, and smart home automation.',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.0982736239466!2d90.4265438153628!3d23.815124892217646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c64c103a8093%3A0xd660a4f50365294a!2sBashundhara%20Residential%20Area%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1622344318784!5m2!1sen!2sbd',
      featured: true,
      verified: true,
      createdAt: new Date().toISOString()
    }
  ],
  lands: [
    {
      id: 'land-1',
      slug: 'purbachal-sector-12',
      title: 'Premium Residential Plot in Purbachal',
      category: 'Land',
      district: 'Dhaka',
      area: 'Purbachal',
      address: 'Sector 12',
      price: '৳ 1.5 Crore',
      size: '5 Katha',
      status: 'Available',
      description: 'Prime residential land ready for construction. Features wide road access and all utility connections.',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1032&q=80',
      galleryImages: [],
      featured: true,
      verified: true,
      createdAt: new Date().toISOString()
    }
  ],
  ready_flats: [
    {
      id: 'rf-1',
      slug: 'dhanmondi-ready-flat',
      title: 'Dhanmondi Lake View Ready Flat',
      category: 'Ready Flat',
      district: 'Dhaka',
      area: 'Dhanmondi',
      address: 'Road 8A',
      price: '৳ 4.2 Crore',
      size: '2800 sqft',
      bedrooms: 4,
      bathrooms: 4,
      garage: 2,
      status: 'Available',
      description: 'Exclusive ready-to-move apartment with stunning views of Dhanmondi Lake.',
      coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
      galleryImages: [],
      featured: true,
      verified: true,
      createdAt: new Date().toISOString()
    }
  ],
  interior_projects: [
    {
      id: 'ip-1',
      slug: 'luxury-office-design',
      title: 'Corporate HQ Luxury Interior',
      category: 'Interior Design',
      district: 'Dhaka',
      area: 'Gulshan',
      price: 'Contact for Quote',
      size: '5000 sqft',
      status: 'Completed',
      description: 'A state-of-the-art office interior blending modern minimalism with soft gold accents and premium glass elements.',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop'
      ],
      featured: true,
      verified: true,
      createdAt: new Date().toISOString()
    }
  ]
};

export async function GET() {
  try {
    const batch = db.batch();
    
    // Seed each collection
    for (const [collectionName, items] of Object.entries(seedData)) {
      const ref = db.collection(collectionName);
      for (const item of items) {
        const docRef = ref.doc(item.id);
        batch.set(docRef, item);
      }
    }
    
    await batch.commit();
    
    return NextResponse.json({ success: true, message: 'Premium database seeded successfully' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed database', details: error.message || error.toString() }, { status: 500 });
  }
}
