import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Key,
  ArrowRight,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  Eye,
  ExternalLink,
  ChevronRight,
  X,
  Copy,
  Check,
  Calendar,
  Phone,
  Tag,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import {
  auth,
  signInAdmin,
  signOutAdmin,
  sendAdminPasswordReset,
  getAdminIdToken,
  onAuthStateChanged,
  User
} from '../../services/firebase.ts';
import { EBOOK_CURRENCY_SYMBOL } from '../../config/ebookConfig.ts';

interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  couponCode?: string;
  productTitle: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAYMENT_PROCESSING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED' | 'MANUAL_REVIEW';
  createdAt: string;
  updatedAt: string;
  gatewayOrderId?: string;
  gatewayCheckoutUrl?: string;
  gatewayQrUrl?: string;
  gatewayUpiUri?: string;
  paymentReference?: string;
  paymentVerifiedAt?: string;
  verifiedAmount?: number;
  downloadToken?: string;
  downloadTokenExpiresAt?: string;
  downloadCount: number;
  lastDownloadedAt?: string;
  isSandbox: boolean;
}

interface AdminStats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  totalRevenue: number;
  conversionRate: number;
}

export const FirebaseAdminPanel: React.FC = () => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuthServer, setCheckingAuthServer] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Forgot password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'revenue' | 'settings'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedDownloadLink, setCopiedDownloadLink] = useState(false);
  const [orderActionLoading, setOrderActionLoading] = useState(false);
  const [orderActionMsg, setOrderActionMsg] = useState('');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Price Setting in Admin
  const [editPrice, setEditPrice] = useState<number>(19);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number>(299);
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceFeedback, setPriceFeedback] = useState('');

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      if (user) {
        setCurrentUser(user);
        // Verify with server that this Firebase user is an authorized admin
        await verifyWithBackend(user);
      } else {
        setCurrentUser(null);
        setIsAuthorized(false);
        setOrders([]);
        setStats(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Authorize admin with server using Firebase ID token
  const verifyWithBackend = async (user: User) => {
    setCheckingAuthServer(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (res.status === 401) {
        setIsAuthorized(false);
        setLoginError('Your session has expired. Please sign in again.');
        await signOutAdmin();
        return;
      }

      if (res.status === 403) {
        setIsAuthorized(false);
        setLoginError('Access Denied.');
        await signOutAdmin();
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to verify administrator status');
      }

      const data = await res.json();
      setIsAuthorized(true);
      setOrders(data.orders || []);
      setStats(data.stats || null);
      if (data.config) {
        setConfig(data.config);
        setEditPrice(data.config.price || 19);
        setEditOriginalPrice(data.config.originalPrice || 299);
      }
    } catch (err: any) {
      console.error('Backend authorization check failed:', err);
      setIsAuthorized(false);
      setLoginError('Access Denied.');
    } finally {
      setCheckingAuthServer(false);
      setAuthLoading(false);
    }
  };

  // 3. Fetch Admin Data (Orders & Stats)
  const fetchDashboardData = async () => {
    if (!auth.currentUser) return;
    setLoadingData(true);
    setDataError('');
    try {
      const idToken = await getAdminIdToken();
      if (!idToken) throw new Error('Unauthenticated');

      const res = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (res.status === 401) {
        setDataError('Your session has expired. Please sign in again.');
        setIsAuthorized(false);
        await signOutAdmin();
        return;
      }

      if (res.status === 403) {
        setDataError('Access Denied.');
        setIsAuthorized(false);
        return;
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setStats(data.stats || null);
      if (data.config) {
        setConfig(data.config);
        setEditPrice(data.config.price || 19);
        setEditOriginalPrice(data.config.originalPrice || 299);
      }
    } catch (err: any) {
      setDataError(err?.message || 'Failed to load store data');
    } finally {
      setLoadingData(false);
    }
  };

  // 4. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setLoginLoading(true);
    try {
      const user = await signInAdmin(email, password);
      // Wait for verifyWithBackend triggered by onAuthStateChanged
      setLoginSuccess('Authentication successful. Verifying permissions...');
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      const code = err?.code || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-email'
      ) {
        setLoginError('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        setLoginError('Too many failed attempts. Please try again later.');
      } else {
        setLoginError('Invalid email or password.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // 5. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');

    if (!resetEmail) {
      setResetError('Please enter your administrator email address.');
      return;
    }

    setResetLoading(true);
    try {
      await sendAdminPasswordReset(resetEmail);
      setResetMessage('Password reset link sent! Check your inbox to set a new password.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setResetError('Failed to send reset email. Ensure the email address is registered.');
    } finally {
      setResetLoading(false);
    }
  };

  // 6. Handle Logout
  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setCurrentUser(null);
      setIsAuthorized(false);
      setOrders([]);
      setStats(null);
      setSelectedOrder(null);
      setEmail('');
      setPassword('');
    }
  };

  // 7. Handle Order Action (Renew Token)
  const handleRenewToken = async (orderId: string) => {
    setOrderActionLoading(true);
    setOrderActionMsg('');
    try {
      const idToken = await getAdminIdToken();
      const res = await fetch(`/api/admin/orders/${orderId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ action: 'renew_token' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to renew token');

      setOrderActionMsg('Download token renewed for 48 hours!');
      // Update local state
      setOrders(prev => prev.map(o => o.orderId === orderId ? data.order : o));
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(data.order);
      }
    } catch (err: any) {
      setOrderActionMsg(err.message || 'Action failed');
    } finally {
      setOrderActionLoading(false);
    }
  };

  // 8. Update Price
  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrice(true);
    setPriceFeedback('');
    try {
      const idToken = await getAdminIdToken();
      const res = await fetch('/api/admin/price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          price: editPrice,
          originalPrice: editOriginalPrice
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update price');

      setPriceFeedback(`Successfully updated price to ${EBOOK_CURRENCY_SYMBOL}${data.price}!`);
      setTimeout(() => setPriceFeedback(''), 4000);
    } catch (err: any) {
      setPriceFeedback(`Error: ${err.message}`);
    } finally {
      setSavingPrice(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PAID' && order.status === 'SUCCESS') ||
      (statusFilter === 'PENDING' && (order.status === 'PENDING' || order.status === 'PAYMENT_PROCESSING')) ||
      (statusFilter === 'FAILED' && (order.status === 'FAILED' || order.status === 'EXPIRED')) ||
      (statusFilter === 'REFUNDED' && order.status === 'REFUNDED');

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesSearch =
      order.orderId.toLowerCase().includes(q) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(q)) ||
      (order.customerPhone && order.customerPhone.includes(q)) ||
      (order.paymentReference && order.paymentReference.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // Loading spinner during initial auth check
  if (authLoading || checkingAuthServer) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-300">Verifying Administrator Session...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ADMIN LOGIN VIEW (if unauthenticated or unauthorized)
  // -------------------------------------------------------------
  if (!currentUser || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
        <div className="max-w-md w-full">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Nexorian Control</h1>
            <p className="text-xs text-slate-400 mt-1">Firebase Protected Administrator Portal</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl backdrop-blur-md">
            {!isForgotPassword ? (
              // Sign In Form
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400" />
                    <span>Admin Sign In</span>
                  </h2>
                  <span className="text-[11px] font-mono bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 px-2 py-0.5 rounded-full">
                    Production Auth
                  </span>
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                {loginSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{loginSuccess}</span>
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300">Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setResetEmail(email);
                        setLoginError('');
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Forgot Password View
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-indigo-400" />
                    <span>Password Reset</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetError('');
                      setResetMessage('');
                    }}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed text-left">
                  Enter your registered Firebase administrator email address. Firebase will send an official password reset link.
                </p>

                {resetError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{resetError}</span>
                  </div>
                )}

                {resetMessage && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resetMessage}</span>
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300">Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {resetLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <span>Send Password Reset Email</span>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 text-center text-[11px] text-slate-600">
            Protected with Firebase Enterprise Security &bull; Zero Public Registration
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED & AUTHORIZED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white tracking-tight">Nexorian Control</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                Live Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xs">
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'revenue'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Actions: Refresh & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={loadingData}
            title="Refresh Store Data"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {dataError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{dataError}</span>
            </span>
            <button
              onClick={fetchDashboardData}
              className="underline hover:text-rose-100 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 1: OVERVIEW DASHBOARD
        ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
              
              {/* Total Orders */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stats?.totalOrders ?? orders.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">All created orders</div>
                </div>
              </div>

              {/* Paid Orders */}
              <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <span className="text-xs font-semibold">Paid Orders</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                    {stats?.paidOrders ?? orders.filter(o => o.status === 'SUCCESS').length}
                  </div>
                  <div className="text-[11px] text-emerald-400/70 mt-1 font-medium">
                    Verified through FamGateway
                  </div>
                </div>
              </div>

              {/* Pending Orders */}
              <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <span className="text-xs font-semibold">Pending Orders</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                    {stats?.pendingOrders ?? orders.filter(o => o.status === 'PENDING' || o.status === 'PAYMENT_PROCESSING').length}
                  </div>
                  <div className="text-[11px] text-amber-400/70 mt-1 font-medium">
                    Awaiting customer payment
                  </div>
                </div>
              </div>

              {/* Failed / Expired Orders */}
              <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-rose-400 mb-2">
                  <span className="text-xs font-semibold">Failed Orders</span>
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-rose-300">
                    {stats?.failedOrders ?? orders.filter(o => o.status === 'FAILED' || o.status === 'EXPIRED').length}
                  </div>
                  <div className="text-[11px] text-rose-400/70 mt-1 font-medium">Expired or cancelled</div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between text-indigo-300 mb-2">
                  <span className="text-xs font-semibold">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {EBOOK_CURRENCY_SYMBOL}{stats?.totalRevenue ?? orders.filter(o => o.status === 'SUCCESS').reduce((acc, curr) => acc + curr.amount, 0)}
                  </div>
                  <div className="text-[11px] text-indigo-300/80 mt-1 font-medium">
                    100% Net Collected
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Status Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-300 font-medium">FamGateway Live Processing:</span>
                <span className="text-emerald-400 font-bold">ACTIVE &bull; Direct UPI QR</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Current Ebook Price: <strong className="text-white">{EBOOK_CURRENCY_SYMBOL}{config?.price || 19}</strong></span>
                <span>Authorized Admin: <strong className="text-indigo-400 font-mono">{currentUser.email}</strong></span>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Recent Orders</h3>
                  <p className="text-xs text-slate-400">Real-time purchase stream from store</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-sm">
                  No orders recorded yet. As soon as a customer clicks Buy, the order will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date/Time</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.slice(0, 6).map((order) => (
                        <tr key={order.orderId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                            {order.orderId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{order.customerName}</div>
                            <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {EBOOK_CURRENCY_SYMBOL}{order.amount}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : order.status === 'PENDING' || order.status === 'PAYMENT_PROCESSING'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {order.status === 'SUCCESS' ? 'PAID' : order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: FULL ORDERS MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Name, Email, Phone, or UTR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
                {['ALL', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  Showing {filteredOrders.length} of {orders.length} orders
                </h3>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-sm">
                  No orders match your search or filter criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">WhatsApp</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">UTR / Transaction Ref</th>
                        <th className="py-3 px-4">Ebook Downloads</th>
                        <th className="py-3 px-4">Date &amp; Time</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredOrders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                            {order.orderId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{order.customerName}</div>
                            <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {order.customerPhone || '—'}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {EBOOK_CURRENCY_SYMBOL}{order.amount}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : order.status === 'PENDING' || order.status === 'PAYMENT_PROCESSING'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {order.status === 'SUCCESS' ? 'PAID' : order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">
                            {order.paymentReference || '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-300">
                              {order.downloadCount} {order.downloadCount === 1 ? 'download' : 'downloads'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="text-[10px] text-slate-500">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: REVENUE & ANALYTICS
        ------------------------------------------------------------- */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Paid Revenue</span>
                <div className="text-3xl font-black text-emerald-400 mt-2">
                  {EBOOK_CURRENCY_SYMBOL}{stats?.totalRevenue ?? 0}
                </div>
                <p className="text-xs text-slate-500 mt-1">Directly received into FamGateway merchant account</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Order Value</span>
                <div className="text-3xl font-black text-white mt-2">
                  {EBOOK_CURRENCY_SYMBOL}{config?.price || 19}
                </div>
                <p className="text-xs text-slate-500 mt-1">Single instant digital purchase</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Customers</span>
                <div className="text-3xl font-black text-indigo-400 mt-2">
                  {stats?.paidOrders ?? orders.filter(o => o.status === 'SUCCESS').length}
                </div>
                <p className="text-xs text-slate-500 mt-1">Readers with full instant book access</p>
              </div>
            </div>

            {/* Orders Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Payment Status Breakdown</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Paid (SUCCESS)</span>
                    <span className="text-emerald-400 font-bold">
                      {orders.filter(o => o.status === 'SUCCESS').length} ({orders.length > 0 ? Math.round((orders.filter(o => o.status === 'SUCCESS').length / orders.length) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{
                        width: `${orders.length > 0 ? (orders.filter(o => o.status === 'SUCCESS').length / orders.length) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Pending (Checkout Opened)</span>
                    <span className="text-amber-400 font-bold">
                      {orders.filter(o => o.status === 'PENDING' || o.status === 'PAYMENT_PROCESSING').length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{
                        width: `${orders.length > 0 ? (orders.filter(o => o.status === 'PENDING' || o.status === 'PAYMENT_PROCESSING').length / orders.length) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Failed / Abandoned</span>
                    <span className="text-rose-400 font-bold">
                      {orders.filter(o => o.status === 'FAILED' || o.status === 'EXPIRED').length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all"
                      style={{
                        width: `${orders.length > 0 ? (orders.filter(o => o.status === 'FAILED' || o.status === 'EXPIRED').length / orders.length) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: SETTINGS & CONFIGURATION
        ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            
            {/* Price Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="font-bold text-white text-base">Store Pricing Control</h3>
                <p className="text-xs text-slate-400">
                  Update live ebook price. Changes are saved server-side and immediately update all checkout and QR code payments.
                </p>
              </div>

              {priceFeedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  priceFeedback.startsWith('Error')
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {priceFeedback}
                </div>
              )}

              <form onSubmit={handleSavePrice} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Live Selling Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500">Currently ₹{config?.price || 19}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Original Strike Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500">Currently ₹{config?.originalPrice || 299}</span>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingPrice}
                    className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {savingPrice ? 'Updating Price...' : 'Save Price'}
                  </button>
                </div>
              </form>
            </div>

            {/* FamGateway Integration Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="font-bold text-white text-base">FamGateway Integration</h3>
                <p className="text-xs text-slate-400">Merchant gateway for UPI QR and payment processing</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Gateway Status</span>
                  <span className="text-emerald-400 font-bold">Connected &bull; 256-bit Encrypted</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Payment Methods</span>
                  <span className="text-white font-semibold">UPI QR Code &bull; Google Pay, PhonePe, Paytm</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Server Webhook URL</span>
                  <span className="font-mono text-indigo-300 select-all">/api/webhook</span>
                </div>
              </div>
            </div>

            {/* Google Drive Delivery Mirror */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="font-bold text-white text-base">Google Drive Verified Delivery</h3>
                <p className="text-xs text-slate-400">High-speed download fallback for paid customers</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Ebook File</span>
                  <span className="text-white font-semibold">Complete 235 Pages Edition (808 KB)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Drive Link</span>
                  <a
                    href="https://drive.google.com/file/d/1lf3YJue6sx1257giWYZ-XFrj6ORU9qTI/view?usp=drivesdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open in Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* -------------------------------------------------------------
          ORDER DETAILS DRAWER / MODAL
      ------------------------------------------------------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-xl w-full rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Order Details</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedOrder.status === 'SUCCESS'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {selectedOrder.status === 'SUCCESS' ? 'PAID' : selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderActionMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{orderActionMsg}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-300">{selectedOrder.orderId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedOrder.orderId);
                      setCopiedOrderId(true);
                      setTimeout(() => setCopiedOrderId(false), 2000);
                    }}
                    className="p-1 text-slate-500 hover:text-white cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Customer Name</span>
                <span className="text-white font-semibold">{selectedOrder.customerName}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Customer Email</span>
                <span className="text-white font-mono">{selectedOrder.customerEmail}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">WhatsApp / Phone</span>
                <span className="text-white font-mono">{selectedOrder.customerPhone || '—'}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Amount Paid</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {EBOOK_CURRENCY_SYMBOL}{selectedOrder.amount}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Payment Reference / UTR</span>
                <span className="font-mono text-slate-300 select-all">{selectedOrder.paymentReference || 'Pending verification'}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Created At</span>
                <span className="text-slate-300">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Ebook Download Count</span>
                <span className="text-white font-semibold">{selectedOrder.downloadCount} times</span>
              </div>

              {selectedOrder.downloadToken && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 mt-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Secure Download Link</span>
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/api/download/${selectedOrder.downloadToken}`;
                        navigator.clipboard.writeText(link);
                        setCopiedDownloadLink(true);
                        setTimeout(() => setCopiedDownloadLink(false), 2000);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {copiedDownloadLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDownloadLink ? 'Copied' : 'Copy Customer Link'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 truncate select-all">
                    {window.location.origin}/api/download/{selectedOrder.downloadToken}
                  </div>
                  {selectedOrder.downloadTokenExpiresAt && (
                    <div className="text-[10px] text-slate-500">
                      Link valid until: {new Date(selectedOrder.downloadTokenExpiresAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
              <button
                onClick={() => handleRenewToken(selectedOrder.orderId)}
                disabled={orderActionLoading || selectedOrder.status !== 'SUCCESS'}
                className="py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer"
              >
                {orderActionLoading ? 'Renewing...' : 'Renew Download Link (48 hrs)'}
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
