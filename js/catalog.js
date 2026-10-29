export function parseCatalog(text) {
  const [header, ...lines] = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (header !== 'id;name;category;price;rating') throw new Error('Неверные столбцы CSV');
  const ids = new Set();
  return lines.filter(line => line.trim()).map(line => {
    const fields = line.split(';').map(field => field.trim());
    const [id, name, category, price, rating] = fields;
    const item = { id: Number(id), name, category, price: Number(price), rating: Number(rating) };
    if (fields.length !== 5 || !name || !category || !id || !price || !rating || !Number.isInteger(item.id) || item.id < 1 || ids.has(item.id) || !Number.isFinite(item.price) || item.price < 0 || !Number.isFinite(item.rating) || item.rating < 0 || item.rating > 5) throw new Error('Некорректная запись CSV');
    ids.add(item.id);
    return item;
  });
}
export function selectProducts(items, { search = '', category = '', price = '', rating = 0, sort = 'id' } = {}) {
  return items.filter(p => p.name.toLocaleLowerCase('ru').includes(search.trim().toLocaleLowerCase('ru')) && (!category || p.category === category) && (price === '' || p.price <= Number(price)) && p.rating >= Number(rating))
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating || a.id - b.id : a[sort] - b[sort]);
}
