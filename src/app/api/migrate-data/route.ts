import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snapshot = await db.collection('properties').get();
    let migrated = 0;
    const foundCategories: string[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const category = (data.category || '').toLowerCase();
      if (!foundCategories.includes(category)) foundCategories.push(category);
      
      let targetCollection = '';
      if (category === 'land') {
        targetCollection = 'lands';
      } else if (category === 'ready flat' || category === 'ready-flat') {
        targetCollection = 'ready_flats';
      } else if (category === 'interior design' || category === 'interior-design') {
        targetCollection = 'interior_projects';
      } else {
        // Leave in properties or update its structure
        targetCollection = 'properties_v2'; 
      }

      if (targetCollection) {
        // Ensure new advanced fields exist (or null) so they fit the new schema
        const newData = {
          ...data,
          galleryImages: data.images || [],
          videoUrl: data.videoUrl || '',
          mapUrl: data.googleMapUrl || data.mapUrl || '',
          metaTitle: data.title,
          metaDescription: data.description ? data.description.substring(0, 150) : '',
          keywords: data.title.split(' '),
        };

        await db.collection(targetCollection).doc(doc.id).set(newData);
        migrated++;
      }
    }

    return NextResponse.json({ success: true, migrated, foundCategories });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
