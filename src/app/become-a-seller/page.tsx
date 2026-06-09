'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, UploadCloud, CheckCircle2, MapPin, DollarSign, FileText, Phone, User, Mail, Link as LinkIcon, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { dbClient } from '@/lib/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BecomeASellerPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    category: '',
    propertyTitle: '',
    district: '',
    area: '',
    address: '',
    expectedPrice: '',
    description: '',
    googleMapUrl: '',
    whatsapp: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Create Seller Inquiry
      const inquiryRef = await addDoc(collection(dbClient, 'seller_inquiries'), {
        ...formData,
        status: 'new',
        propertyImages: [], // Could be implemented with storage later
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Create Lead
      await addDoc(collection(dbClient, 'leads'), {
        leadId: \`L-\${Math.floor(1000 + Math.random() * 9000)}\`,
        source: 'Seller Inquiry',
        sellerInquiryId: inquiryRef.id,
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        propertyTitle: formData.propertyTitle,
        category: formData.category,
        status: 'new',
        assignedAgent: 'Unassigned',
        createdAt: serverTimestamp()
      });

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error submitting seller inquiry:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-background rounded-2xl shadow-xl p-10 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Property Submitted Successfully!</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Thank you for choosing RS Property Development. Our team will review your property and contact you shortly.
          </p>
          <Button variant="primary" size="lg" onClick={() => {
            setIsSubmitted(false);
            setFormData({
              fullName: '', phone: '', email: '', category: '', propertyTitle: '',
              district: '', area: '', address: '', expectedPrice: '', description: '',
              googleMapUrl: '', whatsapp: '', notes: ''
            });
          }}>
            Submit Another Property
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-24 pb-20">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Become A Seller
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            List your premium property, land, or ready flat with RS Property Development. Reach thousands of potential buyers across Bangladesh.
          </motion.p>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="container max-w-4xl mt-[-40px] px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background rounded-2xl shadow-2xl overflow-hidden border border-border"
        >
          <div className="p-8 border-b border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Building size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Property Registration Form</h2>
                <p className="text-muted-foreground">Please provide accurate details for the best valuation.</p>
              </div>
            </div>
          </div>
          
          <form className="p-8 space-y-10" onSubmit={handleSubmit}>
            {/* 1. Personal Information */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2 border-b border-border pb-2">
                <User size={18} className="text-muted-foreground" />
                1. Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="e.g. +880 1XXXXXXXXX" className="w-full h-12 pl-12 pr-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="WhatsApp No." className="w-full h-12 pl-12 pr-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. john@example.com" className="w-full h-12 pl-12 pr-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
              </div>
            </section>
            
            {/* 2. Property Details */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2 border-b border-border pb-2">
                <Building size={18} className="text-muted-foreground" />
                2. Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Property Type *</label>
                  <select name="category" required value={formData.category} onChange={handleChange} className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                    <option value="">Select Category</option>
                    <option value="Property">Property</option>
                    <option value="Land">Land</option>
                    <option value="Ready Flat">Ready Flat</option>
                    <option value="Interior Design">Interior Design Project</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Property Title *</label>
                  <input type="text" name="propertyTitle" required value={formData.propertyTitle} onChange={handleChange} placeholder="e.g. 5 Katha Plot in Purbachal" className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">District *</label>
                  <input type="text" name="district" required value={formData.district} onChange={handleChange} placeholder="e.g. Dhaka" className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Area *</label>
                  <input type="text" name="area" required value={formData.area} onChange={handleChange} placeholder="e.g. Gulshan" className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-muted-foreground" size={18} />
                    <textarea name="address" required value={formData.address} onChange={handleChange} placeholder="Sector, Block, Road, House No." rows={2} className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"></textarea>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Expected Price (BDT) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" name="expectedPrice" required value={formData.expectedPrice} onChange={handleChange} placeholder="e.g. 1,50,00,000" className="w-full h-12 pl-12 pr-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Property Description *</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-muted-foreground" size={18} />
                    <textarea name="description" required value={formData.description} onChange={handleChange} placeholder="Describe the property features, nearby amenities, road access, etc." rows={4} className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"></textarea>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 3. Additional Details */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2 border-b border-border pb-2">
                <LinkIcon size={18} className="text-muted-foreground" />
                3. Additional Details
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Google Map Location URL</label>
                  <input type="url" name="googleMapUrl" value={formData.googleMapUrl} onChange={handleChange} placeholder="https://maps.google.com/..." className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Property Images</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <UploadCloud size={48} className="mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-foreground font-medium mb-1">Drag & drop images here or <span className="text-primary">browse</span></p>
                    <p className="text-sm text-muted-foreground">Upload up to 10 high-quality images (Max 5MB each)</p>
                    <input type="file" multiple accept="image/*" className="hidden" />
                  </div>
                  <p className="text-xs text-muted-foreground italic">* Image uploading logic can be integrated via admin panel after submission.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Additional Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any specific requirements or notes?" rows={3} className="w-full p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"></textarea>
                </div>
              </div>
            </section>
            
            <div className="pt-6 border-t border-border">
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Property for Review'}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                By submitting, you agree to our Terms of Service and Privacy Policy. Our team will verify your property details before listing.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
