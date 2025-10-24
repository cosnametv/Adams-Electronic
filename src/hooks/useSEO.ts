import { useEffect } from 'react';
import { updatePageSEO, addStructuredData, generateStructuredData, SEOData } from '../utils/seo';

export const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    // Update page SEO
    updatePageSEO(seoData);
    
    // Add structured data for rich snippets
    const structuredData = generateStructuredData(seoData);
    addStructuredData(structuredData);
    
    // Cleanup function to reset SEO when component unmounts
    return () => {
      // Reset to default SEO
      updatePageSEO({
        title: 'Adams Electronic - Kenya\'s Leading Electronics Store',
        description: 'Shop the latest electronics in Kenya at Adams Electronic. Find smartphones, laptops, TVs, home appliances, and accessories with free delivery and warranty.',
        type: 'website'
      });
    };
  }, [seoData]);
};
