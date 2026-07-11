import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_SITE_SETTINGS, SiteSettings, normalizeSiteSettings } from '../lib/siteSettings'

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS)

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)

  useEffect(() => {
    let active = true

    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings')
        if (!response.ok) return
        const data = await response.json()
        if (active) {
          setSettings(normalizeSiteSettings(data))
        }
      } catch {
        // Keep defaults when the settings endpoint is unavailable.
      }
    }

    loadSettings()

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => settings, [settings])

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
