import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link } from '../context/RouterContext.tsx';

interface FaqPageProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const FaqPage: React.FC<FaqPageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need any previous coding experience to read this book?',
      a: 'Not at all. The book is specifically written for beginners. Part 1 begins with single-file, 15-line projects that run instantly in your web browser. Each project explains the code line by line and teaches you how to ask AI for explanations if you ever get stuck.'
    },
    {
      q: 'Which AI tool should I use with the book?',
      a: 'Any modern conversational AI works! The master prompts are designed and tested across ChatGPT (GPT-4o), Claude 3.5 Sonnet, and Google Gemini. You do not need any paid AI subscriptions; free tiers work great for all 100 projects.'
    },
    {
      q: 'How do I receive the book after payment?',
      a: 'Immediately upon successful payment, you are shown your order receipt with two instant download options: 1) Direct high-speed PDF download to your device, and 2) Direct Google Drive mirror link so you can save it to your cloud drive or read on phone/tablet/Kindle.'
    },
    {
      q: 'How does payment work? Is it secure?',
      a: 'We use FamGateway, a secure 256-bit encrypted merchant UPI gateway. You can pay with Google Pay, PhonePe, Paytm, BHIM, FamPay, or any banking app via direct UPI QR code or mobile deep-link.'
    },
    {
      q: 'What format is the ebook in?',
      a: 'You get a clean, high-resolution PDF formatted specifically for reading on laptops, monitors, tablets, and phones, with copy-pasteable code blocks and clickable table of contents.'
    },
    {
      q: 'Can I use the projects in my personal portfolio or for clients?',
      a: 'Yes, 100%! All 100 projects are meant to be customized, expanded, and showcased in your personal portfolio or on your GitHub profile. You own whatever you build.'
    },
    {
      q: 'Are future updates included?',
      a: 'Yes. When we release updated editions with new projects or prompts, you can download the latest version for free using your original Order ID.'
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Frequently Asked Questions</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-slate-600">
            Everything you need to know about the ebook, AI prompts, formats, and instant delivery.
          </p>
        </div>

        {/* Accordion FAQ */}
        <div className="space-y-4 mb-14">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-indigo-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Still have a question?
            </h3>
            <p className="text-xs text-slate-500">
              Get in touch or start building right away with instant digital access.
            </p>
          </div>
          <button
            onClick={onBuyClick}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Get Ebook Now ({currencySymbol}{price})
          </button>
        </div>

      </div>
    </div>
  );
};
