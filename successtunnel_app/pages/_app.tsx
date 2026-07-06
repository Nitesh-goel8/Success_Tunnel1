import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import QuickContact from '../components/QuickContact'
import Chatbot from '../components/Chatbot'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Success Tunnel</title>
      </Head>
      <Component {...pageProps} />
      <QuickContact />
      <Chatbot />
    </>
  )
}
