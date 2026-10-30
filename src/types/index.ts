export type CommodityType = 
  | 'RSS-4'
  | 'RSS-3'
  | 'Field Latex (60% DRC)'
  | 'Cup Lump (50% DRC)'
  | 'ISNR-20 / TSR-20';

export interface PricePoint {
  date: string;
  price: number;
}

export interface RubberCommodityPrice {
  id: string;
  commodity: CommodityType;
  gradeDescription: string;
  currentPrice: number;
  previousPrice: number;
  change24h: number;
  changePct: number;
  currency: string;
  unit: string;
  region: string;
  updatedAt: string;
  sevenDayHistory: PricePoint[];
  weeklyHigh: number;
  weeklyLow: number;
  monthlyAverage: number;
  marketSentiment: 'Bullish' | 'Stable' | 'Soft';
}

export interface TappingMachineUpdate {
  id: string;
  version: string;
  date: string;
  title: string;
  category: 'Firmware Update' | 'Maintenance Advisory' | 'Field Trial Report' | 'Safety Notice';
  summary: string;
  details: string;
  affectedModels: string[];
}

export interface TappingMachine {
  id: string;
  name: string;
  brand: string;
  modelCode: string;
  type: 'Handheld Electric' | 'Tree-Mounted Robotic' | 'Semi-Automated Spiral';
  tagline: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  powerSource: string;
  batteryLife: string;
  treesPerHour: number;
  cuttingDepthControl: string;
  cambiumProtection: string;
  weightKg: number;
  bladeType: string;
  warrantyMonths: number;
  keyFeatures: string[];
  fieldTestingSummary: string;
  imageUrl?: string;
  badge?: string;
}

export interface EquipmentSupplier {
  id: string;
  name: string;
  businessType: 'Authorized Dealer' | 'Direct Manufacturer Hub' | 'Cooperative Depot' | 'Parts & Service Center';
  rating: number;
  reviewCount: number;
  district: string;
  state: string;
  country: string;
  fullAddress: string;
  distanceKm: number;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  verifiedDealer: boolean;
  offersOnSiteService: boolean;
  offersHomeDelivery: boolean;
  stockedCategories: string[];
  featuredBrands: string[];
  inventoryHighlights: {
    productName: string;
    inStock: boolean;
    estimatedPrice: string;
  }[];
}

export interface YieldCalculationInput {
  treeCount: number;
  drcPercentage: number; // e.g. 32%
  latexGramsPerTree: number; // e.g. 50g to 120g
  tappingDaysPerMonth: number; // typically 12 to 15 days (d2 / alternate day tapping)
  pricePerKgDry: number; // e.g. 192 INR or 65 THB
}

export interface YieldCalculationResult {
  dailyWetLatexKg: number;
  dailyDryRubberKg: number;
  monthlyWetLatexKg: number;
  monthlyDryRubberKg: number;
  grossDailyRevenue: number;
  grossMonthlyRevenue: number;
}

export interface PriceAlert {
  id: string;
  commodity: CommodityType;
  region: string;
  targetPrice: number;
  direction: 'above' | 'below';
  notifyVia: 'sms' | 'whatsapp';
  phoneOrEmail: string;
  isActive: boolean;
  createdAt: string;
}

export interface FarmerGuide {
  id: string;
  title: string;
  category: 'Tapping Techniques' | 'Bark Care & Cambium' | 'Monsoon & Rain Guarding' | 'Processing & DRC';
  readTime: string;
  author: string;
  date: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

export interface DealerApplication {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  district: string;
  state: string;
  country: string;
  businessType: string;
  brandsCarried: string;
  notes: string;
}

