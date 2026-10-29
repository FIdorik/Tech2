import { parseCatalog, selectProducts } from './catalog.js';
const get = id => document.getElementById(id);
const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const pictures = { 'Книги': '01', 'Курсы': '02', 'Инструменты': '03' };
let products = [];
let loaded = false;
function render() {
  // События формы не должны скрывать состояние загрузки или ошибки.
  if (!loaded) return;
  const result = selectProducts(products, Object.fromEntries(['search', 'category', 'price', 'rating', 'sort'].map(id => [id, get(id).value])));
  get('catalog').replaceChildren(...result.map(p => {
    const card = document.createElement('article'); card.className = 'card';
    const img = document.createElement('img'); img.src = `images/product-${pictures[p.category] || '01'}.svg`; img.alt = ''; img.width = 280; img.height = 180;
    const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = p.category;
    const title = document.createElement('h2'); title.textContent = p.name;
    const meta = document.createElement('div'); meta.className = 'card__meta';
    const price = document.createElement('strong'); price.textContent = money.format(p.price);
    const rating = document.createElement('span'); rating.textContent = `★ ${p.rating.toFixed(1)} / 5`; rating.setAttribute('aria-label', `Рейтинг ${p.rating} из 5`);
    meta.append(price, rating); card.append(img, badge, title, meta); return card;
  }));
  get('count').textContent = `Найдено: ${result.length} из ${products.length}`;
  get('message').textContent = products.length === 0
    ? 'В каталоге пока нет товаров.'
    : result.length ? '' : 'Ничего не найдено. Измените или сбросьте фильтры.';
}
get('filters').addEventListener('submit', e => e.preventDefault());
get('filters').addEventListener('input', render);
get('filters').addEventListener('reset', () => setTimeout(render, 0));
get('sort').addEventListener('change', render);
try {
  const response = await fetch('data/catalog.csv');
  if (!response.ok) throw new Error('HTTP ' + response.status);
  products = parseCatalog(await response.text());
  for (const category of new Set(products.map(p => p.category))) get('category').add(new Option(category, category));
  loaded = true;
  render();
} catch (error) {
  get('count').textContent = 'Каталог недоступен';
  get('message').textContent = 'Не удалось загрузить данные. Проверьте файл data/catalog.csv и обновите страницу.';
  console.error(error);
}
