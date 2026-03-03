import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRedesign from './AppRedesign.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRedesign />
  </StrictMode>,
)
