"use client";

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-foreground"
        >
          Ad Soyad
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Adınız ve soyadınız"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          E-posta
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="ornek@email.com"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium text-foreground"
        >
          Telefon (Opsiyonel)
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="+90 (555) 123 45 67"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium text-foreground"
        >
          Mesajınız
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          placeholder="Mesajınızı buraya yazın..."
        />
      </div>

      <button
        type="submit"
        disabled={submitted}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {submitted ? "Gönderildi ✓" : "Gönder"}
      </button>
    </form>
  );
}

