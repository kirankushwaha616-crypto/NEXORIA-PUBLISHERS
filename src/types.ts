export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'
  | 'REFUNDED'
  | 'MANUAL_REVIEW';

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productTitle?: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  paymentVerifiedAt?: string;
  paymentReference?: string;
  downloadToken?: string;
  downloadTokenExpiresAt?: string;
  downloadCount: number;
  isSandbox: boolean;
  gatewayCheckoutUrl?: string;
  gatewayQrUrl?: string;
  gatewayUpiUri?: string;
}

export interface StoreConfig {
  productTitle: string;
  productSubtitle: string;
  price: number;
  originalPrice: number;
  currency: string;
  currencySymbol: string;
  isSandbox: boolean;
  hasApiKey: boolean;
  gatewayBaseUrl: string;
  supportEmail: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  part: number;
  difficulty: '⭐' | '⭐⭐' | '⭐⭐⭐';
  category: string;
  summary: string;
  skills: string[];
}

export interface BookPart {
  number: number;
  title: string;
  range: string;
  description: string;
  projectCount: number;
  color: string;
  badge: string;
  projects: { id: number; title: string; difficulty: string; summary: string }[];
}

export interface SampleProject {
  id: number;
  title: string;
  part: string;
  difficulty: string;
  whatYouWillBuild: string;
  skills: string[];
  features: string[];
  aiPrompt: string;
  code: string;
  fileStructure: string;
  howItWorks: string;
  customizationIdeas: string[];
  upgradeChallenge: string;
}
