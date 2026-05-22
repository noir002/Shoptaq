export const BRAND = {
  name: 'Shoptaq',
  tagline: 'Retail Operations Platform',
  workspace: 'North America · Enterprise',
};

export const CATEGORIES = [
  'Apparel & Accessories',
  'Health & Wellness',
  'Home Essentials',
  'Outdoor & Fitness',
  'Beauty & Personal Care',
  'Office & Workspace',
  'Gourmet & Pantry',
  'Tech & Gadgets',
];

export const PRODUCT_TYPES = ['Physical', 'Bundle', 'Digital', 'Subscription'];

export const STOCK_STATUS = {
  inStock: { label: 'Available', className: 'badge-success' },
  low: { label: 'Reorder Soon', className: 'badge-warning' },
  out: { label: 'Unavailable', className: 'badge-danger' },
};

export const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard', label: 'Operations Hub', icon: 'dashboard' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { path: '/products', label: 'SKU Catalog', icon: 'products' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/analytics', label: 'Business Insights', icon: 'analytics' },
      { path: '/ai', label: 'Merchandising Studio', icon: 'ai' },
    ],
  },
];
