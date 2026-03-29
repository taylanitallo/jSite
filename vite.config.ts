import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // [SECURITY] Desativa source maps em produção — impede engenharia reversa
    sourcemap: false,
    // [SECURITY] Ofuscação máxima via Terser
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn', 'console.debug'],
        passes: 3,
      },
      mangle: {
        // Embaralha nomes de variáveis, funções e propriedades
        toplevel: true,
        properties: false,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        // [SECURITY] Nomes de chunks sem pistas sobre a estrutura interna
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash][extname]',
        entryFileNames: 'assets/[hash].js',
        // Fragmenta o bundle dificultando análise completa
        manualChunks: undefined,
      },
    },
  },
})
