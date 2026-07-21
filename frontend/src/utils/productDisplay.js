export function ratingFor(productId) {
  const seed = (productId * 2654435761) % 1000;
  return Math.round((3.5 + (seed / 1000) * 1.4) * 10) / 10;
}

export function ratingCountFor(productId) {
  const seed = (productId * 40503) % 5000;
  return 20 + seed;
}

export function discountFor(productId) {
  const seed = productId % 4;
  if (seed === 0) return 0;
  return 10 + ((productId * 17) % 51);
}

export function mrpFor(price, productId) {
  const discount = discountFor(productId);
  if (discount === 0) return null;
  return Math.round((price / (1 - discount / 100)) * 100) / 100;
}

export function badgeFor(productId) {
  const mod = productId % 7;
  if (mod === 0) return "BESTSELLER";
  if (mod === 3) return "TRENDING";
  if (mod === 5) return "NEW";
  return null;
}
