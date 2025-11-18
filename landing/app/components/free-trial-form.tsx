"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function FreeTrialForm() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent("7 Gün Ücretsiz Deneme Talebi");
    const body = encodeURIComponent(
      `Merhaba,\n\n7 gün ücretsiz deneme talep ediyorum.\n\nAd Soyad: ${formData.name}\nİşletme Adı: ${formData.businessName}\n\nTeşekkürler.`
    );
    
    window.location.href = `mailto:diyetka@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", businessName: "" });
    }, 3000);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Ad Soyad *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Adınız ve soyadınız"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="businessName" className="text-sm font-medium text-foreground">
          İşletme Adı *
        </label>
        <input
          type="text"
          id="businessName"
          required
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="İşletme veya ofis adınız"
        />
      </div>

      <motion.button
        type="submit"
        disabled={submitted}
        className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg shadow-primary/25"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {submitted ? "E-posta Açılıyor ✓" : "7 Gün Ücretsiz Deneme Başlat"}
      </motion.button>
      
      <p className="text-xs text-center text-muted-foreground">
        Formu gönderdiğinizde e-posta uygulamanız açılacak ve talebiniz otomatik olarak hazırlanacaktır.
      </p>
    </motion.form>
  );
}

