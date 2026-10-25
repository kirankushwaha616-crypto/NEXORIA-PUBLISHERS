/**
 * CENTRAL SINGLE CONFIGURATION SOURCE OF TRUTH
 * Ebook pricing & core parameters.
 * Note: The server also validates and strictly enforces these values.
 */

export const EBOOK_PRICE = 19;
export const EBOOK_ORIGINAL_PRICE = 299;
export const EBOOK_CURRENCY = 'INR';
export const EBOOK_CURRENCY_SYMBOL = '₹';
export const EBOOK_MERCHANT_UPI_ID = 'ashishkk@fam';

export const GDRIVE_EBOOK_URL = 'https://drive.google.com/file/d/1lf3YJue6sx1257giWYZ-XFrj6ORU9qTI/view?usp=drivesdk';
export const GDRIVE_DIRECT_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1lf3YJue6sx1257giWYZ-XFrj6ORU9qTI';

export const EBOOK_META = {
  title: '100 Mini Projects You Can Build With AI',
  subtitle: 'From Beginner to Builder — Practical Projects, AI Prompts & Complete Code',
  coverImage: '/ebook-cover.png',
  logoImage: '/logo.png',
  authorNote: 'Build small. Build often. The rest will come.',
  pagesCount: 235,
  projectsCount: 100,
  promptsCount: 100,
  partsCount: 5,
  format: 'Instant Digital PDF Download',
  fileSize: 'Complete 235 Pages Edition (808 KB)',
  rating: 'Beginner to Builder Curriculum',
  gdriveUrl: GDRIVE_EBOOK_URL,
  gdriveDirectDownload: GDRIVE_DIRECT_DOWNLOAD_URL
};
