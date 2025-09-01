import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Main.tsx loaded')

try {
  const rootElement = document.getElementById("root")
  console.log('📍 Root element:', rootElement)
  
  if (!rootElement) {
    throw new Error('Root element not found!')
  }

  console.log('✅ Creating React root...')
  const root = createRoot(rootElement)
  
  console.log('✅ Rendering App...')
  root.render(<App />)
  
  console.log('✅ App rendered successfully!')
} catch (error) {
  console.error('❌ Error in main.tsx:', error)
  
  // Fallback display
  const rootElement = document.getElementById("root")
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; background: red; color: white; font-family: Arial;">
        <h1>React Error</h1>
        <p>Error: ${error.message}</p>
        <p>Check console for details</p>
      </div>
    `
  }
}
