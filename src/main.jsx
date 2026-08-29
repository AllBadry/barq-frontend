import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { PopupProvider } from './context/usePopup.jsx'
import { initLazyAnim } from './lib/lazyAnim.js'

// إيقاف الأنيميشنات الزخرفية خارج الشاشة لتجنب تعلّق السكرول على الجوال/الايباد
initLazyAnim()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <PopupProvider>
          <App />
        </PopupProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
