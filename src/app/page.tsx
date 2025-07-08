// src/app/page.tsx
import ConvertForm from '@/components/ConvertForm'

export const metadata = {
  title: 'Convertidor MP4 a MP3 Online Gratis - Rápido y Seguro',
  description: 'Convierte archivos MP4 a MP3 gratis y al instante. Sube tu vídeo, conviértelo en audio de alta calidad y descárgalo fácilmente. Sin registro.',
  keywords: 'convertidor mp4 a mp3, mp4 a mp3 online, extraer audio mp4, convertir video a audio, herramienta mp3 gratis',
  openGraph: {
    title: 'Convertidor MP4 a MP3 Online',
    description: 'Convierte tus archivos MP4 a MP3 sin instalar nada. Gratis, rápido y seguro.',
    url: 'https://mp4-to-mp3.vercel.app/',
    siteName: 'Convertidor MP4 a MP3',
    images: [
      {
        url: 'https://tudominio.com/preview.png',
        width: 800,
        height: 600,
        alt: 'Ejemplo de conversión MP4 a MP3',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-white p-4">
      <section className="text-center max-w-xl mx-auto mb-8 text-gray-700 text-sm">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">Convertidor de MP4 a MP3 Online</h1>
        <p>
          Convierte archivos de vídeo MP4 a audio MP3 directamente en tu navegador. Sin instalaciones, sin registro, completamente gratis y seguro. Ideal para extraer música o audio de vídeos.
        </p>
      </section>
      <ConvertForm />
    </main>
  )
}
