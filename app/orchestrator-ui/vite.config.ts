import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Plugin to copy the system prompt to public directory
function copyPromptPlugin() {
  return {
    name: 'copy-prompt',
    configResolved() {
      // Copy prompt file to public directory on server start
      const srcPath = join(__dirname, '../../prompts/orchestrator_system_prompt.md')
      const destDir = join(__dirname, 'public/prompts')
      const destPath = join(destDir, 'orchestrator_system_prompt.md')

      try {
        mkdirSync(destDir, { recursive: true })
        copyFileSync(srcPath, destPath)
        console.log('✓ Copied system prompt to public/prompts/')
      } catch (error) {
        console.error('Failed to copy system prompt:', error)
      }
    },
    handleHotUpdate({ file, server }: any) {
      // Watch for changes to the SOURCE prompt file only (not the destination in public/)
      const srcPath = join(__dirname, '../../prompts/orchestrator_system_prompt.md')

      if (file === srcPath) {
        const destPath = join(__dirname, 'public/prompts/orchestrator_system_prompt.md')

        try {
          copyFileSync(srcPath, destPath)
          console.log('✓ Updated system prompt')
          // Trigger a full reload
          server.ws.send({ type: 'full-reload' })
        } catch (error) {
          console.error('Failed to update system prompt:', error)
        }
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyPromptPlugin()],
  server: {
    watch: {
      // Exclude the public/prompts directory to prevent infinite loops
      // (we only want to watch the source prompts directory)
      ignored: ['**/public/prompts/**']
    }
  }
})
