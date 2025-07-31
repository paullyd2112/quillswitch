import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin to remove console statements in production
const removeConsolePlugin = () => {
  return {
    name: 'remove-console',
    transform(code: string, id: string) {
      if (process.env.NODE_ENV === 'production') {
        // Remove console.log, console.debug, console.info statements
        // Keep console.warn and console.error for important issues
        return {
          code: code
            .replace(/console\.log\s*\([^)]*\)\s*;?/g, '')
            .replace(/console\.debug\s*\([^)]*\)\s*;?/g, '')
            .replace(/console\.info\s*\([^)]*\)\s*;?/g, '')
            // Remove empty lines left by console removal
            .replace(/^\s*[\r\n]/gm, ''),
          map: null
        };
      }
      return null;
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && removeConsolePlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-select']
        }
      }
    },
    // Additional security for production builds
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: ['log', 'debug', 'info'], // Remove console statements
        drop_debugger: true, // Remove debugger statements
      },
      mangle: {
        safari10: true, // Fix Safari 10 issues
      },
    },
  },
  define: {
    // Remove development flags in production
    __DEV__: mode === 'development',
    'process.env.NODE_ENV': JSON.stringify(mode),
  }
}));
