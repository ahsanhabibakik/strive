import { MetadataRoute } from 'next'
import { clientEnv } from '@/lib/config/env'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: clientEnv.APP_NAME,
    short_name: 'Strive',
    description: clientEnv.APP_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    categories: ['productivity', 'lifestyle', 'education'],
    lang: 'en',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      }
    ],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'View your goal dashboard',
        url: '/dashboard',
        icons: [{ src: '/dashboard-icon.png', sizes: '96x96' }]
      },
      {
        name: 'Create Goal',
        short_name: 'New Goal',
        description: 'Create a new goal',
        url: '/dashboard?action=create',
        icons: [{ src: '/create-icon.png', sizes: '96x96' }]
      }
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        type: 'image/png',
        sizes: '1280x720',
        form_factor: 'wide'
      },
      {
        src: '/screenshot-mobile.png',
        type: 'image/png',
        sizes: '540x720',
        form_factor: 'narrow'
      }
    ]
  }
}