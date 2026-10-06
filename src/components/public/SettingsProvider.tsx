"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { prisma } from "@/lib/db";

export interface SiteSettings {
  siteName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsappNumber: string | null;
  address: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({
            siteName: data.siteName || "HSE BRIDGE",
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            whatsappNumber: data.whatsappNumber,
            address: data.address,
            instagramUrl: data.instagramUrl,
            linkedinUrl: data.linkedinUrl,
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}