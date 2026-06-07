import React from 'react';
import { Building2, Users, FileText, TrendingUp, Home, CheckCircle, Clock } from 'lucide-react';
import { db } from '@/lib/firebase/admin';

// Force dynamic since dashboard data changes frequently
export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  try {
    const collections = ['properties', 'lands', 'ready_flats', 'interior_projects'];
    let totalCount = 0;
    let publishedCount = 0;
    let recentProperties: any[] = [];

    for (const coll of collections) {
      const allCount = await db.collection(coll).count().get();
      totalCount += allCount.data().count || 0;

      const pubCount = await db.collection(coll).where('status', '==', 'Available').count().get();
      publishedCount += pubCount.data().count || 0;

      const recentSnap = await db.collection(coll).orderBy('createdAt', 'desc').limit(2).get();
      const recent = recentSnap.docs.map(doc => ({ id: doc.id, collectionName: coll, ...doc.data() }));
      recentProperties = [...recentProperties, ...recent];
    }

    const blogsCount = await db.collection('posts').count().get();
    
    const inquiriesSnap = await db.collection('inquiries').get();
    let totalInquiries = 0;
    let newInquiries = 0;
    
    inquiriesSnap.forEach(doc => {
      totalInquiries++;
      if (doc.data().status === 'New') {
        newInquiries++;
      }
    });
    
    // Sort combined recent by createdAt
    recentProperties.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return dateB - dateA;
    });

    return {
      totalProperties: totalCount,
      publishedProperties: publishedCount,
      totalBlogs: blogsCount.data().count || 0,
      recentProperties: recentProperties.slice(0, 5),
      totalInquiries,
      newInquiries
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      totalProperties: 0,
      publishedProperties: 0,
      totalBlogs: 0,
      recentProperties: [],
      totalInquiries: 0,
      newInquiries: 0
    };
  }
}

export default async function AdminDashboardOverview() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to the RS Property Development Admin Panel.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Properties</h3>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">New Leads / Inquiries</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-blue-600">{stats.newInquiries}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Published Blogs</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Lifetime Leads</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">Inquiries received</p>
          </div>
        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Activity */}
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Recent Properties</h3>
            <p className="text-sm text-muted-foreground">
              Properties that were recently added or updated.
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-8">
              {stats.recentProperties.map((plot) => (
                <div key={plot.id} className="flex items-center">
                  <div className="bg-muted h-9 w-9 rounded-md flex items-center justify-center overflow-hidden">
                    {plot.image || plot.coverImage ? (
                       <img src={plot.image || plot.coverImage} alt={plot.title} className="h-full w-full object-cover" />
                    ) : (
                       <Home className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <a href={`/admin/manage/${plot.collectionName}/${plot.id}`} className="hover:underline">
                        {plot.title}
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {plot.collectionName.replace('_', ' ')} • {plot.type}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground bg-green-100 border-transparent">
                      {plot.status || 'Active'}
                    </span>
                  </div>
                </div>
              ))}
              
              {stats.recentProperties.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No properties found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links / Overview */}
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Property Status</h3>
            <p className="text-sm text-muted-foreground">
              Overview of your portfolio.
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              
              <div className="flex items-center p-3 rounded-lg border">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Total Active</p>
                </div>
                <div className="text-sm font-bold">{stats.publishedProperties}</div>
              </div>

              <div className="flex items-center p-3 rounded-lg border">
                <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pending Approval</p>
                </div>
                <div className="text-sm font-bold">0</div>
              </div>

              <div className="flex items-center p-3 rounded-lg border">
                <div className="h-5 w-5 rounded-full bg-blue-500 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sold</p>
                </div>
                <div className="text-sm font-bold">0</div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
