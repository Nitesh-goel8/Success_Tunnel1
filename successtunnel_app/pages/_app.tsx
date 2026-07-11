import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/next'
import { useRouter } from 'next/router'
import Chatbot from '../components/Chatbot'
import QuickContact from '../components/QuickContact'
import { SiteSettingsProvider, useSiteSettings } from '../components/SiteSettingsProvider'
import '../styles/globals.css'

function DefaultHead() {
  const router = useRouter()
  const settings = useSiteSettings()
  const canonicalUrl = `${settings.siteUrl.replace(/\/$/, '')}${router.asPath === '/' ? '' : router.asPath}`

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{settings.siteTitle}</title>
      <meta name="description" content={settings.siteDescription} />
      <meta name="robots" content="index,follow" />
      <meta name="theme-color" content="#0b3a86" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={settings.siteTitle} />
      <meta property="og:description" content={settings.siteDescription} />
      <meta property="og:site_name" content={settings.businessName} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={settings.siteTitle} />
      <meta name="twitter:description" content={settings.siteDescription} />
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const analyticsDebug = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_DEBUG === 'true'

  return (
    <SiteSettingsProvider>
      <DefaultHead />
      <Component {...pageProps} />
      <QuickContact />
      <Chatbot />
      <Analytics debug={analyticsDebug} />
    </SiteSettingsProvider>
  )
}
