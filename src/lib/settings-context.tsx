'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  OFFICIAL_STORE_NAME,
  OFFICIAL_STORE_OWNER,
  OFFICIAL_PHONE_NUMBER,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_EMAIL,
} from './whatsapp';

export interface StoreSettings {
  store_name: string;
  store_logo: string;
  store_owner: string;
  store_phone: string;
  whatsapp_number: string;
  store_email: string;
  store_address: string;
  [key: string]: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  store_name: OFFICIAL_STORE_NAME,
  store_logo: '/logo.png',
  store_owner: OFFICIAL_STORE_OWNER,
  store_phone: OFFICIAL_PHONE_NUMBER,
  whatsapp_number: OFFICIAL_WHATSAPP_NUMBER,
  store_email: OFFICIAL_EMAIL,
  store_address: 'SUNNY Dairy Farm, Dera Ismail Khan, Pakistan',
};

interface SettingsContextValue {
  settings: StoreSettings;
  refreshSettings: () => Promise<void>;
  updateLocalSetting: (key: string, value: string) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  refreshSettings: async () => {},
  updateLocalSetting: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch(`/api/settings?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
          store_name: data.settings.store_name || prev.store_name,
          store_logo: data.settings.store_logo || prev.store_logo,
          store_phone: data.settings.store_phone || prev.store_phone,
          whatsapp_number: data.settings.whatsapp_number || prev.whatsapp_number,
          store_email: data.settings.store_email || prev.store_email,
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch real-time store settings:', err);
    }
  }, []);

  useEffect(() => {
    refreshSettings();

    // Listen to real-time custom updates dispatched from admin panel
    const handleSettingsUpdate = () => {
      refreshSettings();
    };

    window.addEventListener('store_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('store_settings_updated', handleSettingsUpdate);
    };
  }, [refreshSettings]);

  const updateLocalSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings, updateLocalSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(SettingsContext);
}
