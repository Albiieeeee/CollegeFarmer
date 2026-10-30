import { EquipmentSupplier, TappingMachine, YieldCalculationInput, YieldCalculationResult } from '../types';

/**
 * Calculates rubber yield and estimated revenue based on farm metrics.
 * 
 * Formula:
 * - Total wet latex (kg) = (trees * latex grams per tree) / 1000
 * - Dry Rubber Content (DRC kg) = wet latex * (DRC % / 100)
 * - Monthly yield = daily yield * tapping days per month
 * - Revenue = dry rubber kg * price per kg
 */
export function calculateRubberYield(input: YieldCalculationInput): YieldCalculationResult {
  const safeTreeCount = Math.max(0, input.treeCount || 0);
  const safeDrc = Math.max(0, Math.min(100, input.drcPercentage || 0));
  const safeLatexGrams = Math.max(0, input.latexGramsPerTree || 0);
  const safeDays = Math.max(0, Math.min(31, input.tappingDaysPerMonth || 0));
  const safePrice = Math.max(0, input.pricePerKgDry || 0);

  const dailyWetLatexKg = (safeTreeCount * safeLatexGrams) / 1000;
  const dailyDryRubberKg = dailyWetLatexKg * (safeDrc / 100);

  const monthlyWetLatexKg = dailyWetLatexKg * safeDays;
  const monthlyDryRubberKg = dailyDryRubberKg * safeDays;

  const grossDailyRevenue = dailyDryRubberKg * safePrice;
  const grossMonthlyRevenue = monthlyDryRubberKg * safePrice;

  return {
    dailyWetLatexKg: Number(dailyWetLatexKg.toFixed(2)),
    dailyDryRubberKg: Number(dailyDryRubberKg.toFixed(2)),
    monthlyWetLatexKg: Number(monthlyWetLatexKg.toFixed(2)),
    monthlyDryRubberKg: Number(monthlyDryRubberKg.toFixed(2)),
    grossDailyRevenue: Number(grossDailyRevenue.toFixed(2)),
    grossMonthlyRevenue: Number(grossMonthlyRevenue.toFixed(2)),
  };
}

/**
 * Calculates daily price delta and percentage change.
 */
export function calculatePriceDelta(current: number, previous: number): { delta: number; percent: number } {
  const delta = Number((current - previous).toFixed(2));
  const percent = previous !== 0 ? Number(((delta / previous) * 100).toFixed(2)) : 0;
  return { delta, percent };
}

/**
 * Filters and searches equipment suppliers by text query, category, and region.
 */
export function filterSuppliers(
  suppliers: EquipmentSupplier[],
  query: string,
  categoryFilter: string,
  regionFilter: string,
  sortBy: 'distance' | 'rating' | 'name' = 'distance'
): EquipmentSupplier[] {
  const cleanQuery = query.trim().toLowerCase();

  const filtered = suppliers.filter((supplier) => {
    const matchesQuery =
      !cleanQuery ||
      supplier.name.toLowerCase().includes(cleanQuery) ||
      supplier.district.toLowerCase().includes(cleanQuery) ||
      supplier.state.toLowerCase().includes(cleanQuery) ||
      supplier.stockedCategories.some((c) => c.toLowerCase().includes(cleanQuery)) ||
      supplier.inventoryHighlights.some((i) => i.productName.toLowerCase().includes(cleanQuery));

    const matchesCategory =
      categoryFilter === 'all' ||
      supplier.stockedCategories.includes(categoryFilter);

    const matchesRegion =
      regionFilter === 'all' ||
      supplier.district.toLowerCase() === regionFilter.toLowerCase() ||
      supplier.state.toLowerCase() === regionFilter.toLowerCase();

    return matchesQuery && matchesCategory && matchesRegion;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.distanceKm - b.distanceKm;
  });
}

/**
 * Filters tapping machines by search text and machine type.
 */
export function filterMachines(
  machines: TappingMachine[],
  query: string,
  typeFilter: string
): TappingMachine[] {
  const cleanQuery = query.trim().toLowerCase();

  return machines.filter((machine) => {
    const matchesQuery =
      !cleanQuery ||
      machine.name.toLowerCase().includes(cleanQuery) ||
      machine.brand.toLowerCase().includes(cleanQuery) ||
      machine.modelCode.toLowerCase().includes(cleanQuery) ||
      machine.keyFeatures.some((f) => f.toLowerCase().includes(cleanQuery));

    const matchesType = typeFilter === 'all' || machine.type === typeFilter;

    return matchesQuery && matchesType;
  });
}
