import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/widget',
    },
    sitemap: 'https://callcheck.gopikrishnanb.co.in/sitemap.xml',
  }
}
