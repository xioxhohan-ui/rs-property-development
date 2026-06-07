import React from 'react';
import PropertyForm from '../_components/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-muted-foreground mt-1">
          Create a new real estate listing.
        </p>
      </div>

      <PropertyForm mode="create" />
    </div>
  );
}
