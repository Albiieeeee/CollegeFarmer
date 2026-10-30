import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRubberYield, calculatePriceDelta, filterSuppliers, filterMachines } from './rubberMath';
import { EquipmentSupplier, TappingMachine } from '../types';

test('calculateRubberYield computes correct wet latex, dry rubber kg, and revenue', () => {
  // Scenario: 400 trees, 33% DRC, 80g latex per tree, 14 tapping days/month, price 190/kg
  const result = calculateRubberYield({
    treeCount: 400,
    drcPercentage: 33,
    latexGramsPerTree: 80,
    tappingDaysPerMonth: 14,
    pricePerKgDry: 190,
  });

  // 400 trees * 80g = 32,000g = 32 kg wet latex daily
  assert.equal(result.dailyWetLatexKg, 32);

  // 32 kg * 0.33 = 10.56 kg dry rubber daily
  assert.equal(result.dailyDryRubberKg, 10.56);

  // 32 kg * 14 days = 448 kg wet latex monthly
  assert.equal(result.monthlyWetLatexKg, 448);

  // 10.56 kg * 14 days = 147.84 kg dry rubber monthly
  assert.equal(result.monthlyDryRubberKg, 147.84);

  // Daily revenue: 10.56 kg * 190 = 2006.40
  assert.equal(result.grossDailyRevenue, 2006.4);

  // Monthly revenue: 147.84 kg * 190 = 28089.60
  assert.equal(result.grossMonthlyRevenue, 28089.6);
});

test('calculateRubberYield safely handles zero and negative numbers', () => {
  const result = calculateRubberYield({
    treeCount: 0,
    drcPercentage: -10,
    latexGramsPerTree: 0,
    tappingDaysPerMonth: 10,
    pricePerKgDry: 180,
  });

  assert.equal(result.dailyWetLatexKg, 0);
  assert.equal(result.dailyDryRubberKg, 0);
  assert.equal(result.grossDailyRevenue, 0);
});

test('calculatePriceDelta calculates correct delta and percentage change', () => {
  const upward = calculatePriceDelta(195.5, 190.0);
  assert.equal(upward.delta, 5.5);
  assert.equal(upward.percent, 2.89);

  const downward = calculatePriceDelta(186.0, 190.0);
  assert.equal(downward.delta, -4.0);
  assert.equal(downward.percent, -2.11);

  const flat = calculatePriceDelta(190.0, 190.0);
  assert.equal(flat.delta, 0);
  assert.equal(flat.percent, 0);
});

test('filterSuppliers properly filters by category, region, and query', () => {
  const mockSuppliers: EquipmentSupplier[] = [
    {
      id: 'sup-1',
      name: 'Kottayam Rubber Machineries',
      businessType: 'Authorized Dealer',
      rating: 4.8,
      reviewCount: 38,
      district: 'Kottayam',
      state: 'Kerala',
      country: 'India',
      fullAddress: 'MC Road, Kottayam',
      distanceKm: 4.2,
      phone: '+91 94471 23456',
      whatsapp: '+91 94471 23456',
      email: 'sales@kottayamrubber.com',
      openingHours: '8:00 AM - 6:00 PM',
      verifiedDealer: true,
      offersOnSiteService: true,
      offersHomeDelivery: true,
      stockedCategories: ['Electric Tapping Knives', 'Spare Blades', 'Rain Guards'],
      featuredBrands: ['AgriTap', 'BladeMaster'],
      inventoryHighlights: [{ productName: 'AgriTap 4X Battery', inStock: true, estimatedPrice: '₹1,450' }],
    },
    {
      id: 'sup-2',
      name: 'Surat Thani Plantation Robotics',
      businessType: 'Direct Manufacturer Hub',
      rating: 4.9,
      reviewCount: 52,
      district: 'Surat Thani',
      state: 'Southern Thailand',
      country: 'Thailand',
      fullAddress: 'Phunphin, Surat Thani',
      distanceKm: 18.5,
      phone: '+66 77 123 456',
      whatsapp: '+66 81 234 5678',
      email: 'contact@suratthanirobotics.co.th',
      openingHours: '7:30 AM - 5:30 PM',
      verifiedDealer: true,
      offersOnSiteService: true,
      offersHomeDelivery: true,
      stockedCategories: ['Robotic Tree Tappers', 'Solar Chargers'],
      featuredBrands: ['RoboHarvest', 'AutoTap'],
      inventoryHighlights: [{ productName: 'RoboHarvest V2 Clamp', inStock: true, estimatedPrice: '฿2,200' }],
    },
  ];

  // Search by text query
  const searchKottayam = filterSuppliers(mockSuppliers, 'Kottayam', 'all', 'all');
  assert.equal(searchKottayam.length, 1);
  assert.equal(searchKottayam[0].id, 'sup-1');

  // Filter by category
  const roboticFilter = filterSuppliers(mockSuppliers, '', 'Robotic Tree Tappers', 'all');
  assert.equal(roboticFilter.length, 1);
  assert.equal(roboticFilter[0].id, 'sup-2');

  // Filter by non-matching region
  const noMatch = filterSuppliers(mockSuppliers, '', 'all', 'Tokyo');
  assert.equal(noMatch.length, 0);
});

test('filterMachines filters by type and keyword', () => {
  const mockMachines: TappingMachine[] = [
    {
      id: 'm-1',
      name: 'AgriTap Pro 4X',
      brand: 'AgriTap',
      modelCode: 'AT-4X-PRO',
      type: 'Handheld Electric',
      tagline: 'Precision motorized tapping with cambium safe-stop',
      priceRange: '₹14,500 - ₹16,200',
      rating: 4.7,
      reviewCount: 42,
      powerSource: '21V Brushless Lithium-Ion',
      batteryLife: '6 hours / ~750 trees',
      treesPerHour: 120,
      cuttingDepthControl: '0.8mm to 1.8mm dial',
      cambiumProtection: 'Active capacitive micro-sensing',
      weightKg: 0.78,
      bladeType: 'Tungsten Carbide reversible',
      warrantyMonths: 18,
      keyFeatures: ['Night LED Worklight', 'Cambium Auto-Brake', 'Rainproof Seal IP65'],
      fieldTestingSummary: '98.4% cambium preservation score across 45-day Kerala field trial',
    },
    {
      id: 'm-2',
      name: 'TreeRobo T-500',
      brand: 'RoboHarvest',
      modelCode: 'TR-500-SOLAR',
      type: 'Tree-Mounted Robotic',
      tagline: 'Solar-assisted tree collar robot for 3 AM pre-dawn tapping',
      priceRange: '₹28,000 - ₹32,000 per unit',
      rating: 4.8,
      reviewCount: 29,
      powerSource: 'Solar collar with LiFePO4 battery',
      batteryLife: 'Autonomous 14 days without sun',
      treesPerHour: 300,
      cuttingDepthControl: 'Laser optical bark scanner',
      cambiumProtection: 'Optical depth profiling',
      weightKg: 2.1,
      bladeType: 'Micro-rotary spiral cutter',
      warrantyMonths: 24,
      keyFeatures: ['Pre-Dawn 2:30 AM Timer', 'Bluetooth Mesh Network', 'Latex Flow Counter'],
      fieldTestingSummary: 'Increased early-morning latex flow volume by 18% over traditional daylight tapping',
    },
  ];

  const handhelds = filterMachines(mockMachines, '', 'Handheld Electric');
  assert.equal(handhelds.length, 1);
  assert.equal(handhelds[0].id, 'm-1');

  const solarSearch = filterMachines(mockMachines, 'Solar', 'all');
  assert.equal(solarSearch.length, 1);
  assert.equal(solarSearch[0].id, 'm-2');
});
