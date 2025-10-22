import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon, ShieldCheckIcon, UserIcon } from 'lucide-react';
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, role, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, role, navigate]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in');
    }
  };
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary-100 text-primary-700">
              <UserIcon className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              Sign in to Adams Electronic
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <a href="/auth/register" className="font-medium text-primary-600 hover:text-primary-700">
                create a new account
              </a>
            </p>
          </div>
          {error && <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}
          <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md">
              <div className="mb-3">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input id="email-address" name="email" type="email" autoComplete="email" required className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-700">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60" disabled={loading}>
                {loading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : 'Sign in'}
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center">
              {role ? <span className="inline-flex items-center gap-1"><ShieldCheckIcon className="h-4 w-4 text-primary-600" /> Signed in as {role}</span> : 'Use your email and password to sign in.'}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>;
};