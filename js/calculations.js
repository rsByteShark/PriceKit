const UNIT_DEFINITIONS = Object.freeze({
  g: Object.freeze({ dimension: "mass", baseFactor: 1, normalizedFactor: 1000, normalizedLabel: "kg" }),
  kg: Object.freeze({ dimension: "mass", baseFactor: 1000, normalizedFactor: 1000, normalizedLabel: "kg" }),
  ml: Object.freeze({ dimension: "volume", baseFactor: 1, normalizedFactor: 1000, normalizedLabel: "l" }),
  l: Object.freeze({ dimension: "volume", baseFactor: 1000, normalizedFactor: 1000, normalizedLabel: "l" })
});

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const isNonNegative = (value) => isFiniteNumber(value) && value >= 0;

export function calculatePromotion({ regularPrice, paidItems, freeItems }) {
  if (!isNonNegative(regularPrice)) return { valid: false, error: "Podaj cenę równą lub większą od zera." };
  if (!Number.isInteger(paidItems) || paidItems <= 0) return { valid: false, error: "Liczba płatnych sztuk musi być całkowita i większa od zera." };
  if (!Number.isInteger(freeItems) || freeItems < 0) return { valid: false, error: "Liczba darmowych sztuk musi być całkowita i nieujemna." };

  const totalItems = paidItems + freeItems;
  const totalPrice = regularPrice * paidItems;
  return {
    valid: true,
    totalItems,
    totalPrice,
    effectiveUnitPrice: totalPrice / totalItems,
    savings: regularPrice * freeItems,
    discountPercent: (freeItems / totalItems) * 100
  };
}

export function calculatePercentage({ baseAmount, percentage }) {
  if (!isNonNegative(baseAmount)) return { valid: false, error: "Podaj kwotę równą lub większą od zera." };
  if (!isFiniteNumber(percentage) || percentage < 0 || percentage > 100) return { valid: false, error: "Procent musi mieścić się w zakresie od 0 do 100." };

  const percentageValue = baseAmount * (percentage / 100);
  return { valid: true, percentageValue, discountedAmount: baseAmount - percentageValue, increasedAmount: baseAmount + percentageValue };
}

export function calculateQuantityPricing({ packagePrice, packageQuantity, packageUnit, desiredQuantity, desiredUnit }) {
  if (!isNonNegative(packagePrice)) return { valid: false, error: "Podaj cenę opakowania równą lub większą od zera." };
  if (!isFiniteNumber(packageQuantity) || packageQuantity <= 0) return { valid: false, error: "Ilość w opakowaniu musi być większa od zera." };
  if (!isFiniteNumber(desiredQuantity) || desiredQuantity <= 0) return { valid: false, error: "Żądana ilość musi być większa od zera." };

  const source = UNIT_DEFINITIONS[packageUnit];
  const target = UNIT_DEFINITIONS[desiredUnit];
  if (!source || !target) return { valid: false, error: "Wybierz obsługiwaną jednostkę." };
  if (source.dimension !== target.dimension) return { valid: false, error: "Nie można przeliczyć masy na objętość ani objętości na masę." };

  const packageBaseQuantity = packageQuantity * source.baseFactor;
  const desiredBaseQuantity = desiredQuantity * target.baseFactor;
  const pricePerBaseUnit = packagePrice / packageBaseQuantity;
  return {
    valid: true,
    requestedPrice: pricePerBaseUnit * desiredBaseQuantity,
    normalizedPrice: pricePerBaseUnit * target.normalizedFactor,
    normalizedUnit: target.normalizedLabel,
    requestedLabel: `${desiredQuantity} ${desiredUnit}`
  };
}

export function getUnitDefinitions() {
  return UNIT_DEFINITIONS;
}
