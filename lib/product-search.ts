import type { Product } from "./products";

export function productSearchScore(product: Product, rawQuery: string) {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return -1;

  const name = product.name.toLowerCase();
  const brand = product.brand.toLowerCase();
  const category = product.category.toLowerCase();
  const subcategory = product.subcategory.toLowerCase();
  const attributes = product.attributes.join(" ").toLowerCase();
  const haystack = `${name} ${brand} ${category} ${subcategory} ${attributes}`;
  const tokens = query.split(/\s+/).filter(Boolean);

  if (!tokens.every((token) => haystack.includes(token))) return -1;

  let score = tokens.reduce((total, token) => {
    if (name.startsWith(token)) return total + 20;
    if (name.includes(token)) return total + 14;
    if (brand.startsWith(token)) return total + 10;
    if (category.includes(token) || subcategory.includes(token)) return total + 7;
    return total + 3;
  }, 0);

  if (name === query) score += 100;
  if (name.startsWith(query)) score += 45;
  if (brand === query) score += 35;
  return score;
}

export function searchProducts(products: Product[], query: string) {
  return products
    .map((product, index) => ({ product, index, score: productSearchScore(product, query) }))
    .filter((result) => result.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.product);
}
