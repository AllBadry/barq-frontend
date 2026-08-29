// context/usePopup.jsx
import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const PopupContext = createContext(null);

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);

  // دالة الاستدعاء التي سنستخدمها في أي مكان في الموقع
  const showPopup = ({ type = 'info', title, text, confirmText, onConfirm, cancelText, onCancel, content }) => {
    setPopup({ type, title, text, confirmText, onConfirm, cancelText, onCancel, content });
  };

  const hidePopup = () => setPopup(null);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      
      {/* البوب-أب العالمي سيظهر هنا فقط إذا كان هناك بيانات */}
      {popup && createPortal(
        <div dir="rtl" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`relative w-full bg-white text-black border-2 border-black shadow-[10px_10px_0px_#000] p-8 text-center animate-in fade-in zoom-in duration-200 ${popup.content ? 'max-w-md' : 'max-w-sm'}`}>
            <button 
              onClick={() => { if(popup.onCancel) popup.onCancel(); hidePopup(); }} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* محتوى مخصص (نموذج/استمارة) إن وُجد */}
            {popup.content ? (
              <div className="text-right w-full">
                {popup.title && <h3 className="text-2xl font-black mb-3">{popup.title}</h3>}
                {popup.content}
              </div>
            ) : (
              <>
                {/* اختيار الأيقونة واللون حسب نوع البوب-أب */}
                <div className="flex justify-center mb-5">
                  {popup.type === 'success' && <CheckCircle className="w-16 h-16 text-[#25D366]" />}
                  {popup.type === 'error' && <XCircle className="w-16 h-16 text-red-500" />}
                  {popup.type === 'warning' && <AlertTriangle className="w-16 h-16 text-[#e4f542]" />}
                  {popup.type === 'info' && <Info className="w-16 h-16 text-[#407BFF]" />}
                </div>

                <h3 className="text-2xl font-black mb-3">{popup.title}</h3>
                <p className="text-sm font-bold text-neutral-600 leading-relaxed mb-8">{popup.text}</p>
                
                <div className="flex flex-col gap-3">
                  {popup.confirmText && (
                    <button 
                      onClick={() => { if(popup.onConfirm) popup.onConfirm(); hidePopup(); }} 
                      className="w-full bg-black text-white py-3.5 border-2 border-black font-black uppercase hover:bg-[#e4f542] hover:text-black transition-colors shadow-[3px_3px_0px_#000]"
                    >
                      {popup.confirmText}
                    </button>
                  )}
                  <button 
                    onClick={() => { if(popup.onCancel) popup.onCancel(); hidePopup(); }} 
                    className="w-full bg-white text-black py-3 border-2 border-black font-black uppercase hover:bg-neutral-100 transition-colors"
                  >
                    {popup.cancelText || 'إغلاق'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </PopupContext.Provider>
  );
}

// دالة الـ Hook الجاهزة للاستخدام
export const usePopup = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error('usePopup must be used within a PopupProvider');
  return ctx;
};