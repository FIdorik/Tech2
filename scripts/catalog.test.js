import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCatalog, selectProducts } from '../js/catalog.js';
const products = parseCatalog(readFileSync('data/catalog.csv', 'utf8'));
test('dataset содержит 18 товаров и три категории', () => {
 assert.equal(products.length, 18); assert.equal(new Set(products.map(p => p.category)).size, 3);
});
test('фильтрация и сортировка', () => {
 assert.equal(selectProducts(products, {category:'Книги'}).length, 6);
 assert.equal(selectProducts(products, {price:'0'}).length, 0);
 assert.equal(selectProducts(products, {search:'нет такого товара'}).length, 0);
 assert.equal(selectProducts(products, {rating:4.5, sort:'rating'})[0].rating, 4.8);
});
test('поврежденный CSV отклоняется', () => {
 assert.throws(() => parseCatalog('foo'));
 assert.throws(() => parseCatalog('id;name;category;price;rating\n1;A;B;NaN;4'));
});

test('пустой каталог, BOM и пробелы обрабатываются', () => {
 assert.deepEqual(parseCatalog('id;name;category;price;rating\n'), []);
 assert.deepEqual(parseCatalog('\uFEFFid;name;category;price;rating\r\n1; Книга ; Книги ;0;0\r\n'), [
  { id: 1, name: 'Книга', category: 'Книги', price: 0, rating: 0 }
 ]);
});

test('дубликаты, пустые значения и неверные диапазоны отклоняются', () => {
 const header = 'id;name;category;price;rating\n';
 for (const row of ['1; ;Книги;100;4', '1;Книга;Книги; ;4', '1;Книга;Книги;-1;4', '1;Книга;Книги;100;6', '1.5;Книга;Книги;100;4']) {
  assert.throws(() => parseCatalog(header + row));
 }
 assert.throws(() => parseCatalog(header + '1;А;Книги;100;4\n1;Б;Курсы;200;5'));
});

test('фильтры совместимы, поиск не зависит от регистра, сортировка не меняет источник', () => {
 const original = products.map(p => p.id);
 const result = selectProducts(products, {search:' УЧЕБНЫЙ ', category:'Книги', price:'1500', rating:4.5, sort:'price'});
 assert.deepEqual(result.map(p => p.id), [4, 10]);
 assert.deepEqual(selectProducts(products, {sort:'rating'}).slice(0, 3).map(p => p.id), [5, 11, 17]);
 assert.deepEqual(products.map(p => p.id), original);
});
