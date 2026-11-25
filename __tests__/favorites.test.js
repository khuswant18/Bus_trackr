import { sortByFavorites } from '../src/favorites';
import { routes } from '../src/data';

test('puts favourite routes first', () => {
  const sorted = sortByFavorites(routes, ['3']);
  expect(sorted.map((route) => route.id)).toEqual(['3', '1', '2']);
});

test('keeps order when there are no favourites', () => {
  const sorted = sortByFavorites(routes, []);
  expect(sorted.map((route) => route.id)).toEqual(['1', '2', '3']);
});
