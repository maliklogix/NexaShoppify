import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from '@/store/appStore'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function App({ Component, pageProps }: AppProps) {
  const { isAuthenticated } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const isLoginPage = router.pathname === '/login';

  return (
    <>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <DashboardLayout>
           <Component {...pageProps} />
        </DashboardLayout>
      )}
      
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { fontSize: '13px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#121214', color: '#fff' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
        }}
      />
    </>
  )
}

