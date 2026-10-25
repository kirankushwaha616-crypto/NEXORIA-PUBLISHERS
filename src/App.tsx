import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { HowToDownloadModal } from './components/HowToDownloadModal.tsx';
import { SuccessView } from './components/SuccessView.tsx';
import { FirebaseAdminPanel } from './components/admin/FirebaseAdminPanel.tsx';
import { NotFoundPage } from './components/NotFoundPage.tsx';

// Page Views
import { HomePage } from './pages/HomePage.tsx';
import { WhatsInsidePage } from './pages/WhatsInsidePage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { SampleDetailPage } from './pages/SampleDetailPage.tsx';
import { ChallengePage } from './pages/ChallengePage.tsx';
import { PricingPage } from './pages/PricingPage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { BenefitsPage } from './pages/BenefitsPage.tsx';
import { CheatSheetPage } from './pages/CheatSheetPage.tsx';
import { LegalPage } from './pages/LegalPage.tsx';
import { DownloadPage } from './pages/DownloadPage.tsx';

import { RouterProvider, useRouter } from './context/RouterContext.tsx';
import { Order, StoreConfig } from './types.ts';

function AppContent() {
  const { path, navigate, params } = useRouter();
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isHowToDownloadOpen, setIsHowToDownloadOpen] = useState(false);
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);

  // 1. Fetch store settings
  const fetchConfig = () => {
    fetch('/api/config')
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
          throw new Error('Non-JSON response from server');
        }
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setStoreConfig(data);
        }
      })
      .catch(err => {
        console.warn('Store config fetch notice:', err);
        setStoreConfig(prev => prev || {
          productTitle: '100 Mini Projects You Can Build With AI',
          productSubtitle: 'From Beginner to Builder — Practical Projects, AI Prompts & Complete Code',
          price: 19,
          originalPrice: 299,
          currency: 'INR',
          currencySymbol: '₹',
          isSandbox: false,
          hasApiKey: true,
          gatewayBaseUrl: 'https://famgateway.in',
          supportEmail: 'support@ebooks.local'
        });
      });
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // 2. Check for order_id parameter on URL (payment return flow)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderIdParam = searchParams.get('order_id');

    if (orderIdParam) {
      fetch(`/api/orders/${orderIdParam}`)
        .then(async res => {
          if (!res.ok) throw new Error('Order not found');
          return res.json();
        })
        .then((order: Order) => {
          if (order.status === 'SUCCESS') {
            setVerifiedOrder(order);
          } else {
            setActiveOrder(order);
            setPaymentSession({
              qrUrl: order.gatewayQrUrl,
              upiUri: order.gatewayUpiUri,
              checkoutUrl: order.gatewayCheckoutUrl,
              isSandbox: order.isSandbox
            });
            setIsPaymentOpen(true);
          }
        })
        .catch(err => console.warn('URL order lookup notice:', err));
    }
  }, []);

  // Step 1: When user clicks "Buy Now / Instant Download", first show step-by-step download guide & terms approval
  const handleOpenBuy = () => {
    setIsHowToDownloadOpen(true);
  };

  // Step 2: Only after user accepts both mandatory checkboxes, generate the FamGateway UPI QR code
  const handleProceedToPayment = async () => {
    if (isGeneratingPayment) return;
    setIsGeneratingPayment(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Direct FamGateway UPI order creation
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(data?.error || `Failed to initiate payment (${res.status})`);
      }

      setActiveOrder(data.order);
      setPaymentSession(data.payment);
      setIsHowToDownloadOpen(false); // Close instructions modal
      setIsPaymentOpen(true); // Open FamGateway QR modal
    } catch (err: any) {
      console.error('Failed to initiate instant payment:', err);
      window.location.reload();
    } finally {
      setIsGeneratingPayment(false);
    }
  };

  const handlePaymentSuccess = (confirmedOrder: Order) => {
    setIsPaymentOpen(false);
    setVerifiedOrder(confirmedOrder);
    navigate(`/download/${confirmedOrder.orderId}`);
  };

  const handleBackToHome = () => {
    setVerifiedOrder(null);
    setActiveOrder(null);
    navigate('/');
  };

  const currentPrice = storeConfig?.price;
  const currentOriginalPrice = storeConfig?.originalPrice;
  const currentCurrencySymbol = storeConfig?.currencySymbol;

  // -------------------------------------------------------------
  // ROUTE 1: EXACT FIREBASE ADMIN PANEL ROUTE
  // -------------------------------------------------------------
  if (
    path === '/admin' ||
    path === '/admin/' ||
    path === '/nexorian-control-7X9K-admin' ||
    path === '/nexorian-control-7X9K-admin/'
  ) {
    return <FirebaseAdminPanel />;
  }

  // -------------------------------------------------------------
  // ROUTE 2: VERIFIED SUCCESS / DOWNLOAD VIEW (if active)
  // -------------------------------------------------------------
  if (verifiedOrder && (path.startsWith('/download') || path.startsWith('/order-success'))) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <SuccessView
          order={verifiedOrder}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  // Determine which page component to render based on URL route
  const renderPageComponent = () => {
    // 1. Home Route
    if (path === '/' || path === '' || path === '/index.html') {
      return (
        <HomePage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          originalPrice={currentOriginalPrice}
          currencySymbol={currentCurrencySymbol}
          onSelectSample={(id) => navigate(`/sample/${id}`)}
        />
      );
    }

    // 2. What's Inside / Curriculum
    if (path === '/whats-inside' || path === '/curriculum') {
      return (
        <WhatsInsidePage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 3. 100 Projects Directory
    if (path === '/projects') {
      return (
        <ProjectsPage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 4. Sample Detail & Prompt Inspector (/sample/:id)
    if (path.startsWith('/sample/')) {
      return (
        <SampleDetailPage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 5. 30-Day Challenge Plan
    if (path === '/challenge') {
      return (
        <ChallengePage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 6. Pricing & Buy
    if (path === '/pricing' || path === '/buy') {
      return (
        <PricingPage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          originalPrice={currentOriginalPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 7. Frequently Asked Questions
    if (path === '/faq') {
      return (
        <FaqPage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 8. Why Build / Benefits
    if (path === '/benefits') {
      return (
        <BenefitsPage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 9. AI Prompt Cheat Sheet
    if (path === '/cheat-sheet') {
      return (
        <CheatSheetPage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 10. Legal Pages (Privacy, Terms, Refund)
    if (path === '/privacy' || path === '/terms' || path === '/refund') {
      return (
        <LegalPage
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          currencySymbol={currentCurrencySymbol}
        />
      );
    }

    // 11. Download / Lookup Order
    if (path.startsWith('/download') || path.startsWith('/order-success')) {
      return (
        <DownloadPage
          verifiedOrder={verifiedOrder}
          onOpenPayment={(o) => {
            setActiveOrder(o);
            setIsPaymentOpen(true);
          }}
        />
      );
    }

    // 12. Non-existent Route -> 404
    return <NotFoundPage />;
  };

  const isNotFound =
    path !== '/' &&
    path !== '' &&
    path !== '/index.html' &&
    path !== '/whats-inside' &&
    path !== '/curriculum' &&
    path !== '/projects' &&
    !path.startsWith('/sample/') &&
    path !== '/challenge' &&
    path !== '/pricing' &&
    path !== '/buy' &&
    path !== '/faq' &&
    path !== '/benefits' &&
    path !== '/cheat-sheet' &&
    path !== '/privacy' &&
    path !== '/terms' &&
    path !== '/refund' &&
    !path.startsWith('/download') &&
    !path.startsWith('/order-success');

  // If 404, show standalone 404 page
  if (isNotFound) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <Header
        onBuyClick={handleOpenBuy}
        isSandbox={storeConfig?.isSandbox}
        price={currentPrice}
        currencySymbol={currentCurrencySymbol}
      />

      {/* Main Page Route Component */}
      <main className="flex-1">
        {renderPageComponent()}
      </main>

      {/* Footer */}
      <Footer
        onBuyClick={handleOpenBuy}
        price={currentPrice}
        currencySymbol={currentCurrencySymbol}
      />

      {/* Instant Order Generation Loading Overlay */}
      {isGeneratingPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-3 text-center max-w-xs border border-slate-100">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <h4 className="font-bold text-slate-900 text-base">Opening Payment...</h4>
            <p className="text-xs text-slate-500">Generating direct UPI QR Code for {currentCurrencySymbol || '₹'}{currentPrice || 19}</p>
          </div>
        </div>
      )}

      {/* Step 1: How to Download & Terms Acceptance Modal */}
      <HowToDownloadModal
        isOpen={isHowToDownloadOpen}
        onClose={() => setIsHowToDownloadOpen(false)}
        onConfirmProceed={handleProceedToPayment}
        isGenerating={isGeneratingPayment}
        price={currentPrice}
        currencySymbol={currentCurrencySymbol}
      />

      {/* Step 2: FamGateway Payment Modal (generated only after user accepts terms) */}
      {activeOrder && (
        <PaymentModal
          order={activeOrder}
          paymentSession={paymentSession}
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onNewPayment={handleProceedToPayment}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
