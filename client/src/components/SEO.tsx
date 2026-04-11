import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

/**
 * SEO Component for managing meta tags and head elements
 * Use this component in each page to set proper meta tags for search engines
 */
export function SEO({
  title,
  description,
  keywords = "gimnastika, Zagrebačka županija, natjecanja, treneri, klubovi",
  ogImage = "https://gszz.manus.space/og-image.jpg",
  ogUrl = "https://gszz.manus.space",
  canonical,
}: SEOProps) {
  useEffect(() => {
    // Set page title
    document.title = `${title} | GSZZ`;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Set keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywords;
      document.head.appendChild(meta);
    }

    // Open Graph tags for social media
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute("content", title);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      meta.content = title;
      document.head.appendChild(meta);
    }

    const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:description");
      meta.content = description;
      document.head.appendChild(meta);
    }

    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute("content", ogImage);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:image");
      meta.content = ogImage;
      document.head.appendChild(meta);
    }

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute("content", ogUrl);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:url");
      meta.content = ogUrl;
      document.head.appendChild(meta);
    }

    // Canonical URL
    if (canonical) {
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute("href", canonical);
      } else {
        const link = document.createElement("link");
        link.rel = "canonical";
        link.href = canonical;
        document.head.appendChild(link);
      }
    }
  }, [title, description, keywords, ogImage, ogUrl, canonical]);

  return null;
}
