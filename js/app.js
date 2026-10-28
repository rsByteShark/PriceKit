import { calculatePercentage, calculatePromotion, calculateQuantityPricing } from "./calculations.js";
import { APP_VERSION } from "./version.js";

const currency = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const decimal = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numberPattern = /^[-+]?\d*(?:[,.]\d+)?$/;
document.querySelector("#app-version").textContent = `v${APP_VERSION}`;

function parseNumber(value) {
  const trimmed = value.trim().replace(/\s/g, "");
  if (!trimmed || !numberPattern.test(trimmed)) return null;
  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value) {
  return Number.isFinite(value) ? currency.format(value) : "";
}

function formatDecimal(value) {
  return Number.isFinite(value) ? decimal.format(value) : "";
}

function setResult(name, value) {
  const element = document.querySelector(`[data-result="${name}"]`);
  if (element) element.textContent = value;
}

function valuesFrom(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function showMessage(form, message) {
  const messageElement = form.querySelector(".form-message");
  messageElement.textContent = message || "";
}

function clearResults(names) {
  names.forEach((name) => setResult(name, ""));
}

function updatePromotion(form) {
  const values = valuesFrom(form);
  const result = calculatePromotion({ regularPrice: parseNumber(values.regularPrice), paidItems: parseNumber(values.paidItems), freeItems: parseNumber(values.freeItems) });
  if (!values.regularPrice && !values.paidItems && !values.freeItems) {
    showMessage(form, "");
    clearResults(["promotion-effective", "promotion-total", "promotion-savings", "promotion-discount", "promotion-count"]);
    return;
  }
  showMessage(form, result.valid ? "" : result.error);
  if (!result.valid) {
    clearResults(["promotion-effective", "promotion-total", "promotion-savings", "promotion-discount", "promotion-count"]);
    return;
  }
  setResult("promotion-effective", formatCurrency(result.effectiveUnitPrice));
  setResult("promotion-total", formatCurrency(result.totalPrice));
  setResult("promotion-savings", formatCurrency(result.savings));
  setResult("promotion-discount", `${formatDecimal(result.discountPercent)}%`);
  setResult("promotion-count", String(result.totalItems));
}

function updatePercentage(form) {
  const values = valuesFrom(form);
  const result = calculatePercentage({ baseAmount: parseNumber(values.baseAmount), percentage: parseNumber(values.percentage) });
  if (!values.baseAmount && !values.percentage) {
    showMessage(form, "");
    clearResults(["percentage-part", "percentage-minus", "percentage-plus"]);
    return;
  }
  showMessage(form, result.valid ? "" : result.error);
  if (!result.valid) {
    clearResults(["percentage-part", "percentage-minus", "percentage-plus"]);
    return;
  }
  setResult("percentage-part", formatCurrency(result.percentageValue));
  setResult("percentage-minus", formatCurrency(result.discountedAmount));
  setResult("percentage-plus", formatCurrency(result.increasedAmount));
}

function updateQuantity(form) {
  const values = valuesFrom(form);
  const result = calculateQuantityPricing({ packagePrice: parseNumber(values.packagePrice), packageQuantity: parseNumber(values.packageQuantity), packageUnit: values.packageUnit, desiredQuantity: parseNumber(values.desiredQuantity), desiredUnit: values.desiredUnit });
  if (!values.packagePrice && !values.packageQuantity && !values.desiredQuantity) {
    showMessage(form, "");
    clearResults(["quantity-requested", "quantity-normalized", "quantity-requested-label", "quantity-normalized-unit"]);
    return;
  }
  showMessage(form, result.valid ? "" : result.error);
  if (!result.valid) {
    clearResults(["quantity-requested", "quantity-normalized", "quantity-requested-label", "quantity-normalized-unit"]);
    return;
  }
  setResult("quantity-requested", formatCurrency(result.requestedPrice));
  setResult("quantity-normalized", formatCurrency(result.normalizedPrice));
  setResult("quantity-requested-label", result.requestedLabel);
  setResult("quantity-normalized-unit", result.normalizedUnit);
}

const updaters = { promotion: updatePromotion, percentage: updatePercentage, quantity: updateQuantity };
document.querySelectorAll("form[data-calculator]").forEach((form) => {
  const update = () => updaters[form.dataset.calculator](form);
  form.addEventListener("input", update);
  form.addEventListener("change", update);
});

const tabs = [...document.querySelectorAll(".mode-tab")];
const panels = [...document.querySelectorAll("[data-panel]")];
function activateMode(mode) {
  tabs.forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    const active = panel.dataset.panel === mode;
    panel.hidden = !active;
    panel.classList.toggle("is-hidden", !active);
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateMode(tab.dataset.mode));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const nextIndex = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    activateMode(tabs[nextIndex].dataset.mode);
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => undefined));
}
