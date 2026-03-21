#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const https = require('https')

// Configuration: set API_URL or leave default to localhost/dev backend
const API_BASE = process.env.PRODUCT_API_URL || 'http://localhost:5000/api'
const OUTPUT = path.join(__dirname, '..', 'public', 'sitemap.xml')

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http')
    lib.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

async function run() {
  try {
    console.log('Using API base:', API_BASE)
    // Expecting an endpoint that returns an array of products with `slug` or `id` and `updatedAt`
    const products = await fetchJSON(`${API_BASE}/products`)
    const baseUrl = process.env.SITE_URL || 'https://www.nothingelsesolutions.com'

    const urls = []
    // Add homepage
    urls.push({ loc: `${baseUrl}/`, lastmod: new Date().toISOString().slice(0,10), priority: '1.0', changefreq: 'weekly' })

    // Products listing
    urls.push({ loc: `${baseUrl}/products`, lastmod: new Date().toISOString().slice(0,10), priority: '0.8', changefreq: 'weekly' })

    if (Array.isArray(products)) {
      for (const p of products) {
        // prefer slug if available
        const slug = p.slug || (p.handle || p.id)
        if (!slug) continue
        const loc = `${baseUrl}/products/${encodeURIComponent(slug)}`
        const lastmod = p.updatedAt ? p.updatedAt.slice(0,10) : new Date().toISOString().slice(0,10)
        urls.push({ loc, lastmod, priority: '0.7', changefreq: 'weekly' })
      }
    } else {
      console.warn('Products endpoint did not return an array. Write a custom generator or adjust API_URL.')
    }

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
