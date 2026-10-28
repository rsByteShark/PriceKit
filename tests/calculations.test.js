import assert from "node:assert/strict";
import test from "node:test";
import { calculatePercentage, calculatePromotion, calculateQuantityPricing } from "../js/calculations.js";

test("promotion 2 + 1 at 12 PLN", () => {
  assert.deepEqual(calculatePromotion({ regularPrice: 12, paidItems: 2, freeItems: 1 }), {
    valid: true, totalItems: 3, totalPrice: 24, effectiveUnitPrice: 8, savings: 12, discountPercent: 33.33333333333333
  });
});

test("promotion rejects non-positive paid quantity", () => {
  assert.equal(calculatePromotion({ regularPrice: 12, paidItems: 0, freeItems: 1 }).valid, false);
});

test("percentage calculations", () => {
  assert.deepEqual(calculatePercentage({ baseAmount: 80, percentage: 25 }), {
    valid: true, percentageValue: 20, discountedAmount: 60, increasedAmount: 100
  });
});

test("percentage rejects values over 100", () => {
  assert.equal(calculatePercentage({ baseAmount: 80, percentage: 101 }).valid, false);
});

test("quantity pricing converts milliliters to liters", () => {
  const result = calculateQuantityPricing({ packagePrice: 9, packageQuantity: 750, packageUnit: "ml", desiredQuantity: 200, desiredUnit: "ml" });
  assert.equal(result.valid, true);
  assert.equal(result.requestedPrice, 2.4);
  assert.equal(result.normalizedPrice, 12);
  assert.equal(result.normalizedUnit, "l");
});

test("quantity pricing does not mix dimensions", () => {
  assert.equal(calculateQuantityPricing({ packagePrice: 9, packageQuantity: 750, packageUnit: "ml", desiredQuantity: 200, desiredUnit: "g" }).valid, false);
});
