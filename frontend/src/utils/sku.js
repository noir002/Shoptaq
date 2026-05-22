export const toSku = (title = '') => {
  const base = title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((w) => w.slice(0, 3).toUpperCase())
    .join('-');
  const hash = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 9000 + 1000;
  return base ? `STQ-${base}-${hash}` : `STQ-ITEM-${hash}`;
};
