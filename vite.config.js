import { defineConfig } from 'vite'

export default defineConfig({
  // Root directory for the project
  root: '.',
  
  // Public directory for static assets
  publicDir: 'public',
  
  // Server configuration
  server: {
    port: 3000,
    open: true, // Automatically open browser
    host: true, // Allow external connections
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optimize for static HTML site
    rollupOptions: {
      input: {
        main: 'index.html',
        templates: 'TEMPLATE_EXAMPLES.html'
      }
    },
    // Ensure images are copied to build
    copyPublicDir: true,
  },
  
  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  
  // CSS configuration
  css: {
    devSourcemap: true,
  },
  
  // Preview server (for build testing)
  preview: {
    port: 4173,
    open: true,
  }
})