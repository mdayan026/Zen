
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg', 
        'playlist192.png', 
        'playlist512.png',
        'assets/*.png'
      ],
      manifest: {
        name: 'Offline Music Player',
        short_name: 'MusicPlayer',
        theme_color: '#1e293b',
        background_color: '#1e293b',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            "src": "/playlist192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/playlist512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    })
  ]
})
