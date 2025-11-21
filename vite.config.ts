import * as path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  json: {
    stringify: false
  },
  assetsInclude: ['**/*.json'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'interactive': [
            './src/components/interactive/PlayerTypeSimulator',
            './src/components/interactive/RewardScheduleDesigner', 
            './src/components/interactive/FlowChannelEvaluator',
            './src/components/interactive/AIGameMasterGenerator'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
