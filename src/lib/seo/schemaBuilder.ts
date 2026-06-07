/**
 * Enterprise SEO Schema Builder
 * Automatically generates Google-compliant JSON-LD structured data.
 */

const DOMAIN = 'https://rsproperty.com.bd';
const COMPANY_NAME = 'RS Property Development';

/**
 * Organization Schema
 * Placed on homepage and contact page.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": COMPANY_NAME,
    "url": DOMAIN,
    "logo": `${DOMAIN}/logo.png`,
    "image": `${DOMAIN}/office.jpg`,
    "description": "Premium real estate and land development company in Bangladesh. Specializing in plots, commercial spaces, and luxury housing.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Level 12, Premium Tower, Gulshan Avenue",
      "addressLocality": "Dhaka",
      "postalCode": "1212",
      "addressCountry": "BD"
    },
    "telephone": "+8801814963730",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };
}

/**
 * Property (RealEstateListing/Product) Schema
 * Automatically injected into individual Property pages.
 */
export function buildPropertySchema(property: any) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.seoTitle || property.title,
    "description": property.seoDescription || property.description,
    "url": `${DOMAIN}/plots/${property.slug}`,
    "datePosted": property.createdAt,
    "image": property.image || property.images?.[0],
    "offers": {
      "@type": "Offer",
      "price": property.price.replace(/[^0-9.]/g, ''), // Strip text like "Tk" or "Crore"
      "priceCurrency": "BDT",
      "availability": property.status === 'Available' ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
    },
    "about": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address,
        "addressLocality": property.district,
        "addressRegion": property.area,
        "addressCountry": "BD"
      }
    }
  };
}

/**
 * Article/Blog Schema
 * Automatically injected into Blog pages.
 */
export function buildArticleSchema(blog: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.seo?.title || blog.title,
    "description": blog.seo?.description || blog.excerpt,
    "image": blog.image,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt,
    "author": {
      "@type": "Organization",
      "name": COMPANY_NAME,
      "url": DOMAIN
    },
    "publisher": {
      "@type": "Organization",
      "name": COMPANY_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${DOMAIN}/blog/${blog.slug}`
    }
  };
}

/**
 * Breadcrumb Schema
 * Essential for nested URL structures (e.g. Home > Properties > Dhaka > Plot)
 */
export function buildBreadcrumbSchema(items: {name: string, url: string}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${DOMAIN}${item.url}`
    }))
  };
}
