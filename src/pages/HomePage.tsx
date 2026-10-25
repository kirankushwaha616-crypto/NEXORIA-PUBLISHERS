import React from 'react';
import { Hero } from '../components/Hero.tsx';
import { WhatsInside } from '../components/WhatsInside.tsx';
import { PartExplorer } from '../components/PartExplorer.tsx';
import { BookBenefits } from '../components/BookBenefits.tsx';
import { ThirtyDayChallenge } from '../components/ThirtyDayChallenge.tsx';
import { CheatSheetSection } from '../components/CheatSheetSection.tsx';
import { PricingSection } from '../components/PricingSection.tsx';
import { FaqSection } from '../components/FaqSection.tsx';
import { EBOOK_PRICE, EBOOK_ORIGINAL_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link, useRouter } from '../context/RouterContext.tsx';

interface HomePageProps {
  onBuyClick: () => void;
  price?: number;
  originalPrice?: number;
  currencySymbol?: string;
  onSelectSample?: (id: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  originalPrice = EBOOK_ORIGINAL_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL,
  onSelectSample
}) => {
  const { navigate } = useRouter();

  return (
    <div>
      <Hero
        onBuyClick={onBuyClick}
        onExploreClick={() => navigate('/whats-inside')}
        price={price}
        originalPrice={originalPrice}
        currencySymbol={currencySymbol}
      />

      <WhatsInside />

      <PartExplorer
        onSelectSample={(id) => {
          if (onSelectSample) {
            onSelectSample(id);
          } else {
            navigate(`/sample/${id}`);
          }
        }}
      />

      <BookBenefits />

      <ThirtyDayChallenge />

      <CheatSheetSection />

      <PricingSection
        onBuyClick={onBuyClick}
        price={price}
        originalPrice={originalPrice}
        currencySymbol={currencySymbol}
      />

      <FaqSection />
    </div>
  );
};
