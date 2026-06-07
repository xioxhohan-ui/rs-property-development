import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase/admin';
import { ArrowLeft, MapPin, Calendar, Clock, Monitor, Activity, Navigation, Smartphone } from 'lucide-react';
import UserActionButtons from './../_components/UserActionButtons';

export const dynamic = 'force-dynamic';

async function getUserData(userId: string) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return null;

    const locationQuery = await db.collection('user_locations').where('userId', '==', userId).limit(1).get();
    const location = locationQuery.empty ? null : locationQuery.docs[0].data();

    const activityQuery = await db.collection('user_activity').where('userId', '==', userId).orderBy('timestamp', 'desc').limit(20).get();
    const activities = activityQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      id: userDoc.id,
      ...userDoc.data(),
      location,
      activities
    } as any;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserData(id);

  if (!user) {
    notFound();
  }

  const joinDate = user.createdAt ? new Date(user.createdAt._seconds ? user.createdAt._seconds * 1000 : user.createdAt).toLocaleString() : 'Unknown';
  const lastActiveDate = user.lastActive ? new Date(user.lastActive._seconds ? user.lastActive._seconds * 1000 : user.lastActive).toLocaleString() : 'Unknown';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground mt-1">
            Detailed information, activity logs, and location telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl overflow-hidden mb-4 border-4 border-background shadow-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  (user.name || user.email || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <h2 className="text-xl font-bold">{user.name || 'Unknown User'}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              
              <div className="mt-4 flex gap-2 justify-center">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                  {user.role || 'user'}
                </span>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 
                  user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status || 'active'}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" /> Joined</span>
                <span className="text-sm font-medium">{joinDate}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground flex items-center"><Clock className="mr-2 h-4 w-4" /> Last Active</span>
                <span className="text-sm font-medium">{lastActiveDate}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground flex items-center"><Monitor className="mr-2 h-4 w-4" /> Source</span>
                <span className="text-sm font-medium capitalize">{user.registrationSource || 'Direct'}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t flex justify-center">
              <UserActionButtons userId={user.id} currentStatus={user.status || 'active'} currentRole={user.role || 'user'} />
            </div>
          </div>

          {/* Location Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold flex items-center mb-4 pb-2 border-b">
              <MapPin className="mr-2 h-5 w-5 text-primary" /> Location Telemetry
            </h3>
            
            {user.location ? (
              <div className="space-y-4">
                <div className="relative h-32 bg-muted rounded-md overflow-hidden flex items-center justify-center border">
                  <Navigation className="h-8 w-8 text-muted-foreground/50" />
                  <div className="absolute inset-0 bg-primary/5"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">City</div>
                    <div className="text-sm font-medium">{user.location.city || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Region</div>
                    <div className="text-sm font-medium">{user.location.region || user.location.country || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Coordinates</div>
                    <div className="text-xs font-medium">{user.location.latitude?.toFixed(4)}, {user.location.longitude?.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Device</div>
                    <div className="text-sm font-medium capitalize flex items-center">
                      <Smartphone className="mr-1 h-3 w-3" /> {user.location.deviceType || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-20" />
                No location data available. User has not granted consent or has not logged in recently.
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="col-span-1 md:col-span-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 h-full">
            <h3 className="font-semibold flex items-center mb-6 pb-2 border-b">
              <Activity className="mr-2 h-5 w-5 text-primary" /> Recent Activity Logs
            </h3>
            
            {user.activities && user.activities.length > 0 ? (
              <div className="relative border-l pl-6 space-y-8 ml-3">
                {user.activities.map((activity: any) => (
                  <div key={activity.id} className="relative">
                    <span className="absolute -left-8 top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background"></span>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <h4 className="text-sm font-semibold capitalize">{activity.action.replace('_', ' ')}</h4>
                      <time className="text-xs text-muted-foreground mt-1 sm:mt-0">
                        {activity.timestamp ? new Date(activity.timestamp._seconds ? activity.timestamp._seconds * 1000 : activity.timestamp).toLocaleString() : 'Unknown'}
                      </time>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {activity.pageVisited && <span>Visited: <span className="font-medium">{activity.pageVisited}</span></span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No recent activity logs found for this user.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
