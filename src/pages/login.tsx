import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppStore } from '@/store/appStore';
import { Lock, User, Store } from 'lucide-react';
import toast from 'react-hot-toast';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = name + '=; path=/; max-age=0';
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shopInput, setShopInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const { login } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const nexaUser = getCookie('nexa_user');
    if (nexaUser) {
      try {
        const user = JSON.parse(nexaUser);
        if (user?.id && user?.username) {
          login({ id: user.id, username: user.username, role: user.role || 'USER', email: user.email });
          clearCookie('nexa_user');
          toast.success('Welcome! Store connected.');
          router.replace('/');
        }
      } catch (_) {}
    }
  }, [login, router]);

  useEffect(() => {
    const err = router.query.error;
    if (err === 'shopify_hmac_invalid' || err === 'shopify_token_failed' || err === 'shopify_callback_error') {
      toast.error('Shopify connection failed. Please try again.');
    } else if (err === 'shopify_state_invalid') {
      toast.error('Session expired. Please try logging in with Shopify again.');
    }
  }, [router.query.error]);

  const handleShopifyLogin = () => {
    const raw = shopInput.trim().toLowerCase().replace(/\.myshopify\.com$/, '');
    if (!raw) {
      toast.error('Enter your store name (e.g. mystore)');
      return;
    }
    const shop = raw.includes('.') ? raw : `${raw}.myshopify.com`;
    setShopifyLoading(true);
    window.location.href = `/api/shopify/install?shop=${encodeURIComponent(shop)}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        login(data.user);
        toast.success('Welcome back, Admin!');
        router.push('/');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl p-8 relative z-10 shadow-xl border border-gray-200/80">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 mb-4 shadow-lg shadow-emerald-500/25">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">NexaShoppify</h1>
          <p className="text-gray-500">Enter your credentials to access the dashboard</p>
          <p className="text-xs text-gray-400 mt-2">Default: admin / admin</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all sm:text-sm"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all sm:text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Login with Shopify</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={shopInput}
                  onChange={(e) => setShopInput(e.target.value)}
                  placeholder="yourstore"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleShopifyLogin}
                disabled={shopifyLoading}
                className="px-4 py-3 rounded-xl border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-medium text-sm transition-all disabled:opacity-50"
              >
                {shopifyLoading ? 'Redirecting...' : 'Connect'}
              </button>
            </div>
            <p className="text-[10px] text-gray-500">Enter your store name (e.g. mystore for mystore.myshopify.com)</p>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Secure Admin Portal &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
