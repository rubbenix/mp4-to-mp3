/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mp4-to-mp3.vercel.app/', // 🔁 Cámbialo por tu dominio real
  generateRobotsTxt: true,          // Genera robots.txt automáticamente
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  trailingSlash: false,
}
