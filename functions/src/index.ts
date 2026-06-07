import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// 1. Auto-generate Server Timestamps on Property Creation
export const onPropertyCreated = functions.firestore
  .document("properties/{propertyId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Auto SEO Meta tags if not provided
    const metaTitle = data.metaTitle || `${data.propertyType} in ${data.district} - RS Properties`;
    const metaDescription = data.metaDescription || `View this amazing ${data.propertyType} located in ${data.district}. Price: ${data.price}.`;

    return snap.ref.set(
      {
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        metaTitle,
        metaDescription,
        viewCount: 0,
        favoriteCount: 0,
      },
      { merge: true }
    );
  });

// 2. Auto-Update Timestamp on Property Modification
export const onPropertyUpdated = functions.firestore
  .document("properties/{propertyId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Prevent infinite loop if we are just updating the updatedAt field
    if (before.updatedAt?.isEqual(after.updatedAt)) {
      return change.after.ref.set(
        { updatedAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
    }
    return null;
  });

// 3. Track Property Views and Analytics
export const onPropertyViewed = functions.firestore
  .document("property_views/{viewId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const propertyId = data.propertyId;

    if (!propertyId) return null;

    // Increment the viewCount on the main property document
    const propertyRef = db.collection("properties").doc(propertyId);
    
    return db.runTransaction(async (transaction) => {
      const propertyDoc = await transaction.get(propertyRef);
      if (!propertyDoc.exists) return;

      const newViewCount = (propertyDoc.data()?.viewCount || 0) + 1;
      transaction.update(propertyRef, { viewCount: newViewCount });
    });
  });

// 4. Auto-generate Notifications for New Inquiries
export const onInquiryCreated = functions.firestore
  .document("inquiries/{inquiryId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    return db.collection("notifications").add({
      title: "New Property Inquiry",
      message: `You have received a new inquiry from ${data.name} regarding property: ${data.propertyTitle}.`,
      type: "new_inquiry",
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

// 5. Auto-generate Notifications for New Leads
export const onLeadCreated = functions.firestore
  .document("leads/{leadId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    return db.collection("notifications").add({
      title: "New Lead Capture",
      message: `New lead captured from source: ${data.source}. Name: ${data.name}.`,
      type: "new_lead",
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
