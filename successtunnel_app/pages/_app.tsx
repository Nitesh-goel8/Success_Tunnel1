import '../styles/globals.css'
import type { AppProps } from 'next/app'
import QuickContact from '../components/QuickContact'
import Chatbot from '../components/Chatbot'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <QuickContact />
      <Chatbot />
    </>
  )
}
