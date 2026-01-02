"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SuspensionAlert() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // localStorage'da daha önce gösterilip gösterilmediğini kontrol et
    const hasSeenAlert = localStorage.getItem("diyetka-suspension-alert-seen");
    
    if (!hasSeenAlert) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // localStorage'a kaydet ki bir daha gösterilmesin
    localStorage.setItem("diyetka-suspension-alert-seen", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-14 left-0 right-0 z-[60] bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-b border-amber-200/50 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-amber-900">
                    <span className="font-semibold">Önemli Bilgilendirme:</span> RandevuHazır projesi geçici olarak askıya alınmıştır. Şu anda sadece örnek olarak hesap oluşturabilirsiniz.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="Uyarıyı kapat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

