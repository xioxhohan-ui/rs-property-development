import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase/admin';
import { Search, Edit, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getUsers() {
  try {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage roles, view activity logs, and monitor user accounts.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
            />
          </div>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {users.map((user) => (
                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          (user.name || user.email || 'U').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="font-medium">{user.name || 'Unknown User'}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="text-sm">{user.email}</div>
                    {user.phone && <div className="text-xs text-muted-foreground">{user.phone}</div>}
                  </td>
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase bg-muted text-muted-foreground">
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-100 text-green-800 border-transparent' : 
                      user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800 border-transparent' : 
                      'bg-red-100 text-red-800 border-transparent'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt._seconds ? user.createdAt._seconds * 1000 : user.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/users/${user.id}`}>
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-secondary h-8 w-8 text-primary" title="View Profile">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No users found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
