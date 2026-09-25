import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Search,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  IndianRupee,
  Shield,
  Layers,
  Key,
  ExternalLink,
  Sliders,
  Check,
  Copy,
  Tag,
  Eye,
  EyeOff,
  Globe,
  DollarSign,
  HelpCircle,
  Server
} from 'lucide-react';
import { Order } from '../types.ts';
import { EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onConfigUpdated }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Price Edit State
  const [priceInput, setPriceInput] = useState<string>('29');
  const [originalPriceInput, setOriginalPriceInput] = useState<string>('299');
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [priceMessage, setPriceMessage] = useState('');

  // Password Edit State
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  // Pre-load data if token already exists
  useEffect(() => {
    if (isOpen && token) {
      fetchAdminData(token);
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: secretKeyInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator password');
      }

      setToken(data.token);
      localStorage.setItem('admin_token', data.token);
      fetchAdminData(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Admin Data
  const fetchAdminData = async (adminToken?: string) => {
    const currentToken = adminToken || token;
    if (!currentToken) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });

      if (res.status === 401) {
        setToken(null);
        localStorage.removeItem('admin_token');
        return;
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setStats(data.stats || null);
      if (data.config) {
        setConfig(data.config);
        setPriceInput(String(data.config.price || 29));
        setOriginalPriceInput(String(data.config.originalPrice || 299));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Price Update
  const handleUpdatePrice = async (e?: React.FormEvent, customPrice?: number) => {
    if (e) e.preventDefault();
    if (!token) return;

    const targetPrice = customPrice !== undefined ? customPrice : parseInt(priceInput, 10);
    const targetOriginal = parseInt(originalPriceInput, 10);

    if (isNaN(targetPrice) || targetPrice <= 0) {
      setPriceMessage('Please enter a valid price in rupees (greater than 0).');
      return;
    }

    setIsUpdatingPrice(true);
    setPriceMessage('');

    try {
      const res = await fetch('/api/admin/price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          price: targetPrice,
          originalPrice: !isNaN(targetOriginal) ? targetOriginal : undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPriceMessage(`Price updated successfully to ${EBOOK_CURRENCY_SYMBOL}${targetPrice}!`);
        if (customPrice !== undefined) {
          setPriceInput(String(customPrice));
        }
        fetchAdminData(token);
        onConfigUpdated?.();
      } else {
        setPriceMessage(data.error || 'Failed to update price');
      }
    } catch (err) {
      setPriceMessage('Network error updating price');
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 4) {
      setPasswordMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage('');

    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: newPasswordInput.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMessage('Admin password updated successfully! Please note your new password.');
        setNewPasswordInput('');
        fetchAdminData(token);
      } else {
        setPasswordMessage(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPasswordMessage('Network error updating password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Order Actions
  const handleOrderAction = async (orderId: string, action: string, utr?: string) => {
    if (!token) return;
    setActionMessage('');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action, utr })
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message || 'Action executed successfully');
        fetchAdminData(token);
      } else {
        setActionMessage(data.error || 'Failed to perform action');
      }
    } catch (err) {
      setActionMessage('Network error occurred');
    }
  };

  // Sandbox Mode Toggle
  const handleToggleSandbox = async (currentVal: boolean) => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sandboxMode: !currentVal })
      });
      const data = await res.json();
      if (res.ok) {
        fetchAdminData(token);
        onConfigUpdated?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
    setOrders([]);
    setStats(null);
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'SUCCESS' && o.status !== 'SUCCESS') return false;
    if (statusFilter === 'PENDING' && o.status !== 'PENDING' && o.status !== 'PAYMENT_PROCESSING') return false;
    if (statusFilter === 'FAILED' && o.status !== 'FAILED' && o.status !== 'EXPIRED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchOrder = o.orderId.toLowerCase().includes(q);
      const matchRef = (o.paymentReference || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchOrder || matchRef;
    }

    return true;
  });

  const adminUrl = typeof window !== 'undefined' ? `${window.location.origin}/admin` : '/admin';
  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/famgateway` : '/api/webhook/famgateway';
  const currentAdminPassword = config?.adminSecretKey || 'admin2026';

  const discountPercent = parseInt(originalPriceInput, 10) > parseInt(priceInput, 10)
    ? Math.round(((parseInt(originalPriceInput, 10) - parseInt(priceInput, 10)) / parseInt(originalPriceInput, 10)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-left">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Merchant Admin Dashboard
                </h3>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-400/30">
                  /admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live Ebook Store Control, Dynamic Pricing &amp; FamGateway UPI Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area: If logged out, show password screen */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto w-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <Key className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Admin Login
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Enter your admin password to access store settings, change book prices, and manage customer orders.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-800 mb-6 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Default Admin Credentials:</span>
              </div>
              <div>Password: <code className="bg-amber-100 font-mono px-1.5 py-0.5 rounded font-bold text-amber-950">admin2026</code></div>
              <div className="text-[11px] text-amber-700">Direct URL: <code className="font-mono">{adminUrl}</code></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium text-left">
                  {loginError}
                </div>
              )}

              <input
                type="password"
                required
                placeholder="Enter admin password (admin2026)..."
                value={secretKeyInput}
                onChange={e => setSecretKeyInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-sm"
              >
                {isLoading ? 'Verifying...' : 'Unlock Admin Portal'}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard View */
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Quick Access Ribbon: Admin URL & Password */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Admin URL Link */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-950">Admin Panel URL:</span>
                  <code className="bg-white border border-indigo-200 px-2 py-1 rounded font-mono text-[11px] text-indigo-700 font-bold select-all">
                    {adminUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(adminUrl, 'adminUrl')}
                    className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded transition-colors cursor-pointer"
                    title="Copy Admin Link"
                  >
                    {copiedKey === 'adminUrl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {copiedKey === 'adminUrl' && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                </div>

                {/* Password Badge */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-950">Admin Password:</span>
                  <code className="bg-white border border-indigo-200 px-2 py-1 rounded font-mono text-[11px] text-indigo-900 font-bold">
                    {showPassword ? currentAdminPassword : '••••••••'}
                  </code>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-500 hover:text-slate-700"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(currentAdminPassword, 'adminPassword')}
                    className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded transition-colors cursor-pointer"
                    title="Copy Password"
                  >
                    {copiedKey === 'adminPassword' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {copiedKey === 'adminPassword' && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => fetchAdminData()}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Action Flash Message */}
            {actionMessage && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium flex items-center justify-between">
                <span>{actionMessage}</span>
                <button onClick={() => setActionMessage('')} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Metrics Ribbon */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Total Orders
                  </span>
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    {stats.totalOrders}
                  </span>
                </div>

                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Successful
                  </span>
                  <span className="text-2xl font-black text-emerald-800 tabular-nums">
                    {stats.successfulOrders}
                  </span>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                    Pending / Processing
                  </span>
                  <span className="text-2xl font-black text-amber-800 tabular-nums">
                    {stats.pendingOrders}
                  </span>
                </div>

                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                    Verified Revenue
                  </span>
                  <span className="text-2xl font-black text-indigo-900 tabular-nums">
                    {EBOOK_CURRENCY_SYMBOL}{stats.totalRevenue}
                  </span>
                </div>
              </div>
            )}

            {/* TWO-COLUMN ADMIN SETTINGS: 1. Price Control | 2. Gateway & Deployment */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* CARD 1: Ebook Price Control (Requested Feature) */}
              <div className="md:col-span-6 p-5 bg-white rounded-2xl border-2 border-indigo-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        <Tag className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Ebook Price Settings
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      <span className="text-[11px] text-slate-600 font-medium">Current:</span>
                      <span className="font-black text-indigo-700 tabular-nums">
                        {EBOOK_CURRENCY_SYMBOL}{config?.price || 29}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">
                    Change the price anytime. When updated, the landing page, checkout, and FamGateway UPI QR codes will instantly use this new price.
                  </p>

                  {priceMessage && (
                    <div className={`p-2.5 mb-3 rounded-xl text-xs font-semibold ${
                      priceMessage.includes('successfully') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {priceMessage}
                    </div>
                  )}

                  <form onSubmit={handleUpdatePrice} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Selling Price (₹) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            min="1"
                            max="9999"
                            required
                            value={priceInput}
                            onChange={e => setPriceInput(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Original Price (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            min="1"
                            max="9999"
                            value={originalPriceInput}
                            onChange={e => setOriginalPriceInput(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                        Quick Preset Prices:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[19, 29, 49, 99, 149, 199].map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setPriceInput(String(p));
                              handleUpdatePrice(undefined, p);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              parseInt(priceInput, 10) === p
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            ₹{p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {discountPercent > 0 ? `Discount Preview: ${discountPercent}% OFF` : 'No Discount'}
                      </span>

                      <button
                        type="submit"
                        disabled={isUpdatingPrice}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        {isUpdatingPrice ? 'Saving...' : 'Save & Update Price'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* CARD 2: FamGateway & Production Deployment */}
              <div className="md:col-span-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        <Globe className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        FamGateway &amp; Vercel Deployment
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      config?.hasApiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {config?.hasApiKey ? 'FamGateway Live' : 'API Key Missing'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">
                    Configured with live merchant UPI (<code className="font-mono text-slate-700">7380673813@fam</code>).
                  </p>

                  {/* Webhook copy box */}
                  <div className="space-y-1.5 mb-3 text-xs">
                    <label className="text-[11px] font-bold text-slate-600 block">
                      FamGateway Webhook Endpoint (Optional):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={webhookUrl}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-[11px] text-slate-700 select-all"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(webhookUrl, 'webhook')}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'webhook' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Change Admin Password */}
                  <form onSubmit={handleUpdatePassword} className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Change Admin Password:
                    </label>
                    {passwordMessage && (
                      <div className={`p-2 rounded-lg text-xs font-medium ${
                        passwordMessage.includes('successfully') ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {passwordMessage}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="Enter new admin password..."
                        value={newPasswordInput}
                        onChange={e => setNewPasswordInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={isUpdatingPassword || !newPasswordInput.trim()}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isUpdatingPassword ? 'Saving...' : 'Update'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sandbox Toggle */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Testing Mode:
                  </span>
                  <button
                    onClick={() => handleToggleSandbox(config?.isSandbox)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      config?.isSandbox
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Mode: {config?.isSandbox ? 'Sandbox (Test)' : 'Live FamGateway'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['ALL', 'SUCCESS', 'PENDING', 'FAILED'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === tab
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, email, order, UTR..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-72"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Payment Ref / UTR</th>
                      <th className="p-3">Created</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map(o => (
                      <tr key={o.orderId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {o.orderId}
                          {o.isSandbox && (
                            <span className="block text-[10px] text-amber-600 font-medium">Sandbox</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{o.customerName}</div>
                          <div className="text-[11px] text-slate-400">{o.customerEmail}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-600">
                          {o.customerPhone}
                        </td>
                        <td className="p-3 font-bold text-slate-900 tabular-nums">
                          {EBOOK_CURRENCY_SYMBOL}{o.amount}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500 text-[11px]">
                          {o.paymentReference || '—'}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {o.status !== 'SUCCESS' && (
                            <button
                              onClick={() => {
                                const utr = prompt('Enter Bank UTR / Transaction ID (optional):') || '';
                                handleOrderAction(o.orderId, 'mark_success', utr);
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          )}
                          {o.status === 'SUCCESS' && o.downloadToken && (
                            <button
                              onClick={() => handleOrderAction(o.orderId, 'renew_token')}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[11px] font-semibold cursor-pointer"
                              title="Renew 48-hr download token"
                            >
                              Renew Token
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                          No matching orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
