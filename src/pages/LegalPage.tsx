import React from 'react';
import { ShieldCheck, FileText, RefreshCw, ArrowLeft, Mail } from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext.tsx';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';

interface LegalPageProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const { path } = useRouter();

  const isPrivacy = path === '/privacy';
  const isTerms = path === '/terms';
  const isRefund = path === '/refund';

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">
            {isPrivacy ? 'Privacy Policy' : isTerms ? 'Terms of Service' : 'Refund Policy'}
          </span>
        </div>

        {/* Legal Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 text-xs font-semibold">
          <Link
            to="/privacy"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isPrivacy ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isTerms ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Terms of Service
          </Link>
          <Link
            to="/refund"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isRefund ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Refund &amp; Cancellation
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          
          {/* Privacy Policy */}
          {isPrivacy && (
            <>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-2">
                  Privacy Policy
                </h1>
                <p className="text-xs text-slate-400">Last updated: September 2026</p>
              </div>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
                <p>
                  When you purchase the <em>100 Mini Projects You Can Build With AI</em> digital ebook, we receive transactional data including your order identifier, timestamp, and payment status confirmed by our payment gateway. We do not require or harvest invasive personal information.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">2. Payment Security &amp; Zero Storage of Banking Data</h2>
                <p>
                  All payments are processed securely through FamGateway, an authorized merchant UPI gateway. Your bank account details, UPI PINs, and card numbers never touch or reside on our servers.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">3. Cookies and Local Storage</h2>
                <p>
                  We use browser session storage strictly for maintaining your pending checkout session and order fulfillment token so that your direct download link remains accessible to you upon successful purchase.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">4. Third-Party Services</h2>
                <p>
                  Our verified cloud backup uses Google Drive for mirror file access. No user data is sold, rented, or shared with advertisers under any circumstances.
                </p>
              </section>
            </>
          )}

          {/* Terms of Service */}
          {isTerms && (
            <>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-2">
                  Terms of Service
                </h1>
                <p className="text-xs text-slate-400">Last updated: September 2026</p>
              </div>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">1. Digital Purchase &amp; License</h2>
                <p>
                  By purchasing <em>100 Mini Projects You Can Build With AI</em>, you receive a non-exclusive, non-transferable personal license to read the publication and use the included code and prompts for your personal learning, portfolio projects, and commercial software creations.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">2. Intellectual Property &amp; Restrictions</h2>
                <p>
                  The compiled book text, graphics, and instructional materials are protected by copyright. You may not re-upload, re-sell, or distribute the PDF file publicly on file-sharing sites or torrent networks. You are completely free, however, to modify and publish any application code you build using the projects.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">3. Educational Disclaimer</h2>
                <p>
                  This educational book teaches practical software development using modern AI tools. No guarantee of employment, specific salary, or commercial success is made or implied. Your skill growth depends on your personal effort and practice.
                </p>
              </section>
            </>
          )}

          {/* Refund Policy */}
          {isRefund && (
            <>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-2">
                  Refund &amp; Delivery Policy
                </h1>
                <p className="text-xs text-slate-400">Last updated: September 2026</p>
              </div>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">1. Instant Digital Delivery</h2>
                <p>
                  This product is a digital download. Immediately upon successful payment via FamGateway, you receive an instantaneous download button and access to our dedicated Google Drive mirror.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">2. Replacement &amp; Delivery Guarantee</h2>
                <p>
                  If you experience any browser disruption, closed the payment tab accidentally, or experienced a network failure, our system retains your order record. Contact our support team with your transaction reference or Order ID, and we will immediately issue a direct renewal link within 24 hours.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">3. Refund Requests</h2>
                <p>
                  Due to the irrevocable nature of instant digital downloads, refunds are evaluated on a case-by-case basis (e.g. accidental double payments for the same order). Verified double charges are promptly refunded in full via the original payment source.
                </p>
              </section>
            </>
          )}

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>

            <button
              onClick={onBuyClick}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer transition-all"
            >
              Get Ebook ({currencySymbol}{price})
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
