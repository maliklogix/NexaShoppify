import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { fontSize: '13px', borderRadius: '10px', border: '1px solid #e5e7eb' },
          success: { iconTheme: { primary: '#96bf48', secondary: '#fff' } },
        }}
      />
    </>
  )
}
