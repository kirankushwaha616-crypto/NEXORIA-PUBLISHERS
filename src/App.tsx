import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { WhatsInside } from './components/WhatsInside.tsx';
import { PartExplorer } from './components/PartExplorer.tsx';
import { SamplePreviewModal } from './components/SamplePreviewModal.tsx';
import { BookBenefits } from './components/BookBenefits.tsx';
import { ThirtyDayChallenge } from './components/ThirtyDayChallenge.tsx';
import { CheatSheetSection } from './components/CheatSheetSection.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { SuccessView } from './components/SuccessView.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { Order, StoreConfig } from './types.ts';

export default function App() {
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [previewProjectId, setPreviewProjectId] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // 1. Fetch server config
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
        // Fallback default config ensures the page never breaks
        setStoreConfig(prev => prev || {
          productTitle: '100 Mini Projects You Can Build With AI',
          productSubtitle: 'From Beginner to Builder — Practical Projects, AI Prompts & Complete Code',
          price: 9,
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

  // 2. Check URL parameters and pathname (/admin, ?admin=true, ?order_id=...)
  useEffect(() => {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('order_id');
    const adminParam = params.get('admin');

    if (adminParam === 'true' || pathname === '/admin' || pathname === '/admin/') {
      setIsAdminOpen(true);
    }

    if (orderIdParam) {
      fetch(`/api/orders/${orderIdParam}`)
        .then(async res => {
          if (!res.ok) throw new Error('Order not found');
          const contentType = res.headers.get('content-type');
          if (contentType && !contentType.includes('application/json')) {
            throw new Error('Non-JSON response from server');
          }
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

  const handleOpenBuy = () => {
    setIsCheckoutOpen(true);
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    if (window.location.pathname !== '/admin') {
      window.history.pushState({}, document.title, '/admin');
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
      window.history.pushState({}, document.title, '/');
    }
  };

  const handleOrderCreated = (order: Order, session: any) => {
    setIsCheckoutOpen(false);
    setActiveOrder(order);
    setPaymentSession(session);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (confirmedOrder: Order) => {
    setIsPaymentOpen(false);
    setVerifiedOrder(confirmedOrder);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setVerifiedOrder(null);
    setActiveOrder(null);
    // Clear URL params without full reload
    window.history.pushState({}, document.title, window.location.pathname);
  };

  // If customer is on Verified Success screen, show the dedicated delivery view
  if (verifiedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <SuccessView
          order={verifiedOrder}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  const currentPrice = storeConfig?.price;
  const currentOriginalPrice = storeConfig?.originalPrice;
  const currentCurrencySymbol = storeConfig?.currencySymbol;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <Header
        onBuyClick={handleOpenBuy}
        onOpenAdmin={handleOpenAdmin}
        isSandbox={storeConfig?.isSandbox}
        price={currentPrice}
        currencySymbol={currentCurrencySymbol}
      />

      {/* Main Landing Page Content */}
      <main className="flex-1">
        <Hero
          onBuyClick={handleOpenBuy}
          onExploreClick={() => {
            const el = document.getElementById('whats-inside');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          price={currentPrice}
          originalPrice={currentOriginalPrice}
          currencySymbol={currentCurrencySymbol}
        />

        <WhatsInside />

        <PartExplorer
          onSelectSample={(id) => setPreviewProjectId(id)}
        />

        <BookBenefits />

        <ThirtyDayChallenge />

        <CheatSheetSection />

        <PricingSection
          onBuyClick={handleOpenBuy}
          price={currentPrice}
          originalPrice={currentOriginalPrice}
          currencySymbol={currentCurrencySymbol}
        />

        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onBuyClick={handleOpenBuy}
        onOpenAdmin={handleOpenAdmin}
        price={currentPrice}
        currencySymbol={currentCurrencySymbol}
      />

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
        price={currentPrice}
        currencySymbol={currentCurrencySymbol}
      />

      {activeOrder && (
        <PaymentModal
          order={activeOrder}
          paymentSession={paymentSession}
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      <SamplePreviewModal
        projectId={previewProjectId}
        onClose={() => setPreviewProjectId(null)}
        onBuyClick={handleOpenBuy}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        onConfigUpdated={fetchConfig}
      />
    </div>
  );
}
