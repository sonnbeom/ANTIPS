import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectManifest: {
        injectionPoint: undefined,
        rollupFormat: 'iife',
      },
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'classic'
      },
      manifest: {
        name: 'Anti-protective suit',
        short_name: 'Anti-PS',
        theme_color: '#ffffff',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        background_color: '#ffffff',
        orientation: 'portrait'
      },
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      external: ['roslib'] ,
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      transformMixedEsModules: true // CommonJS 모듈도 변환 허용
    },
  },
  preview: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      roslib: 'roslib/build/roslib.js'
    }
  },
  optimizeDeps: {
    include: ['roslib']
  }
})
