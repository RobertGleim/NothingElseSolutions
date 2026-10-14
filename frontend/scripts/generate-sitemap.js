#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const OUTPUT = path.join(__dirname, '..', 'public', 'sitemap.xml')

function run() {
  try {
    const baseUrl = process.env.SITE_URL || 'https://www.nothingelsesolutions.com'

    const urls = []
    // Add homepage
    urls.push({ loc: `${baseUrl}/`, lastmod: new Date().toISOString().slice(0,10), priority: '1.0', changefreq: 'weekly' })

    // Public compliance pages
    urls.push({ loc: `${baseUrl}/privacy`, lastmod: new Date().toISOString().slice(0,10), priority: '0.2', changefreq: 'yearly' })
    urls.push({ loc: `${baseUrl}/terms`, lastmod: new Date().toISOString().slice(0,10), priority: '0.2', changefreq: 'yearly' })
    urls.push({ loc: `${baseUrl}/boroughline/privacy-policy`, lastmod: new Date().toISOString().slice(0,10), priority: '0.2', changefreq: 'yearly' })

    // Compose XML
    const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for (const u of urls) {
      xml.push('  <url>')
      xml.push(`    <loc>${u.loc}</loc>`)
      if (u.lastmod) xml.push(`    <lastmod>${u.lastmod}</lastmod>`)
      if (u.changefreq) xml.push(`    <changefreq>${u.changefreq}</changefreq>`)
      if (u.priority) xml.push(`    <priority>${u.priority}</priority>`)
      xml.push('  </url>')
    }
    xml.push('</urlset>')

    fs.writeFileSync(OUTPUT, xml.join('\n'))
    console.log('Sitemap written to', OUTPUT)
  } catch (err) {
    console.error('Failed generating sitemap:', err.message || err)
    process.exit(1)
  }
}

run()
