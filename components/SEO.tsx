import React, { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  robots?: string;
  schemaJson?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/cafe-hero.png',
  robots = 'index, follow',
  schemaJson,
}) => {
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://abracafe.ir');
  const fullImageUrl = ogImage.startsWith('http')
    ? ogImage
    : typeof window !== 'undefined'
    ? `${window.location.origin}${ogImage}`
    : `https://abracafe.ir${ogImage}`;

  useEffect(() => {
    // بروزرسانی عنوان تب و عنوان مرورگر برای موتورهای جستجو
    const originalTitle = document.title;
    document.title = title;

    // تابع کمکی جهت ایجاد یا بروزرسانی متاتگ‌ها
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // متاتگ‌های پایه
    setMetaTag('name', 'description', description);
    if (keywords) setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', robots);

    // تگ‌های OpenGraph برای شبکه‌های اجتماعی و اشتراک‌گذاری
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:site_name', 'کافه لند');
    setMetaTag('property', 'og:locale', 'fa_IR');

    // تگ‌های توییتر / X
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImageUrl);

    // تگ کانونیکال (Canonical Link)
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // افزودن داده‌های ساختاریافته JSON-LD (Schema.org) برای ایندکس در گوگل
    let scriptTag = document.getElementById('page-json-ld') as HTMLScriptElement | null;
    if (schemaJson) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'page-json-ld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaJson);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // بازگرداندن عنوان اولیه در زمان خروج از صفحه
      document.title = originalTitle;
      const script = document.getElementById('page-json-ld');
      if (script) script.remove();
    };
  }, [title, description, keywords, currentUrl, fullImageUrl, ogType, robots, schemaJson]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}
    </>
  );
};

export default SEO;
