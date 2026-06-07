import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const email = 'admin@rsproperty.com';
    const password = 'Password123!';
    
    try {
      // Try to get user first to see if they exist
      const user = await auth.getUserByEmail(email);
      return NextResponse.json({ 
        message: 'Admin user already exists', 
        email, 
        password: 'Password123!' // Not the real password from DB, just a reminder of what was set
      });
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        // Create user
        const newUser = await auth.createUser({
          email,
          password,
          displayName: 'Super Admin',
        });
        
        // Add to users collection with Role
        await db.collection('users').doc(newUser.uid).set({
          email,
          role: 'Super Admin',
          createdAt: new Date()
        });

        return NextResponse.json({ 
          message: 'Admin user created successfully', 
          email, 
          password 
        });
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
