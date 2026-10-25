import React, { useState } from 'react';
import {
  X,
  Download,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  FileText,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Lock,
  BookOpen
} from 'lucide-react';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';

interface HowToDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmProceed: () => void;
  isGenerating?: boolean;
  price?: number;
  currencySymbol?: string;
}

export const HowToDownloadModal: React.FC<HowToDownloadModalProps> = ({
  isOpen,
  onClose,
  onConfirmProceed,
  isGenerating = false,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const [readSteps, setReadSteps] = useState(false);
  const [readTerms, setReadTerms] = useState(false);

  if (!isOpen) return null;

  const canProceed = readSteps && readTerms && !isGenerating;

  const handleProceed = () => {
    if (!canProceed) return;
    onConfirmProceed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 p-0.5 object-contain shadow-xs"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://lh3.googleusercontent.com/d/17T4S4IHGf926JS3R5JhwTL_bv1kGL4IT';
              }}
            />
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                NEXORA AESTHETIC MART
              </span>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                How to Download &amp; Pay
              </h3>
              <p className="text-[11px] text-slate-500">
                डाउनलोड निर्देश और पेमेंट गाइड &bull; {currencySymbol}{price} Instant Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          
          {/* Quick Notice */}
          <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex items-start gap-3 text-indigo-950 text-xs">
            <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-indigo-900">
                Instant Digital Delivery Guarantee (तुरंत डाउनलोड की गारंटी)
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                पेमेंट करने के बाद आपको कोई इंतज़ार नहीं करना पड़ेगा। क्यूआर कोड स्कैन होते ही 2 सेकंड में पीडीएफ फाइल और गूगल ड्राइव लिंक स्क्रीन पर मिल जाएगा।
              </p>
            </div>
          </div>

          {/* STEP BY STEP GUIDE */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>Step-by-Step Download Process (3 सरल चरण):</span>
            </h4>

            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                1
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <span>Scan Direct UPI QR Code (पेमेंट करें)</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.2 rounded-full">
                    {currencySymbol}{price} Only
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  नीचे दिए बटन पर क्लिक करने पर आपका <strong>FamGateway UPI QR Code</strong> जनरेट होगा। इसे अपने <strong>PhonePe, Google Pay, Paytm, BHIM, Cred या FamPay</strong> से स्कैन करके मात्र {currencySymbol}{price} का सुरक्षित भुगतान करें।
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                2
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Automatic Verification in 2–5 Seconds (ऑटो वेरिफिकेशन)
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  पेमेंट सफल होते ही हमारा सिस्टम <strong>ऑटोमेटिकली वेरिफाई</strong> कर लेगा। आपको पेज रिफ्रेश करने या कोई स्क्रीनशॉट भेजने की कोई ज़रूरत नहीं है।
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/60 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                3
              </div>
              <div className="space-y-1">
                <div className="font-bold text-emerald-950 text-xs sm:text-sm">
                  Instant Download Button &amp; Google Drive Mirror
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  वेरिफिकेशन के तुरंत बाद स्क्रीन पर दो ऑप्शन्स मिलेंगे:
                  <br />
                  &bull; <strong>Direct PDF Download:</strong> अपने मोबाइल/लैपटॉप में एक क्लिक में सेव करें।
                  <br />
                  &bull; <strong>Google Drive Mirror:</strong> सीधे गूगल ड्राइव में खोलें या फ़ोन/टैबलेट में कभी भी पढ़ें।
                </p>
              </div>
            </div>
          </div>

          {/* POLICIES & GUARANTEES BOX */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Refund &amp; Support Policy (रिफंड एवं सपोर्ट पॉलिसी):</span>
            </div>
            
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside leading-relaxed pl-1">
              <li>
                <strong>100% Delivery Assurance:</strong> यदि पेमेंट के बाद इंटरनेट कट जाए या ब्राउज़र बंद हो जाए, तो आपकी Order ID सुरक्षित रहती है। आप <a href="/download" target="_blank" className="text-indigo-600 underline font-semibold">/download</a> पेज से कभी भी दोबारा बुक डाउनलोड कर सकते हैं।
              </li>
              <li>
                <strong>Double Payment Protection:</strong> यदि गलती से एक ही आर्डर पर दोबारा पेमेंट कटता है, तो एक्स्ट्रा पेमेंट 100% सोर्स खाते में रिफंड कर दिया जाएगा।
              </li>
              <li>
                <strong>Zero Personal Data Risk:</strong> आपका यूपीआई पिन या बैंक डिटेल्स हमारे पास कभी स्टोर नहीं होते।
              </li>
            </ul>
          </div>

          {/* TWO MANDATORY CHECKBOXES */}
          <div className="p-4 bg-amber-50/60 border-2 border-amber-200/80 rounded-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              कृपया आगे बढ़ने से पहले दोनों विकल्पों को स्वीकार करें (Mandatory):
            </span>

            {/* Checkbox 1: I have read the step */}
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={readSteps}
                onChange={(e) => setReadSteps(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer accent-indigo-600 shrink-0"
              />
              <span className="text-xs text-slate-800 leading-snug font-medium group-hover:text-slate-900">
                <strong>I have read the step-by-step download instructions.</strong> (मैंने ऊपर दिए गए डाउनलोड करने के सभी स्टेप्स पढ़ लिए हैं।)
              </span>
            </label>

            {/* Checkbox 2: I have read the terms and conditions */}
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={readTerms}
                onChange={(e) => setReadTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer accent-indigo-600 shrink-0"
              />
              <span className="text-xs text-slate-800 leading-snug font-medium group-hover:text-slate-900">
                <strong>I have read and agree to the Terms &amp; Conditions and Refund Policy.</strong> (मैंने नियम, शर्तें और रिफंड पॉलिसी स्वीकार कर ली हैं।)
              </span>
            </label>
          </div>

        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-center">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-bit Encrypted UPI by FamGateway</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleProceed}
              disabled={!canProceed}
              className={`flex-1 sm:flex-none py-3 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                canProceed
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/25 ring-2 ring-blue-500 ring-offset-2'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Payment Session...</span>
                </>
              ) : (
                <>
                  <span>Continue to Payment ({currencySymbol}{price})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
