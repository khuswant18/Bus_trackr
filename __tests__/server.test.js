import http from 'http';
import server from '../server';

function get(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:' + server.address().port + path, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });
  });
}

beforeAll((done) => {
  server.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

test('returns all routes', async () => {
  const res = await get('/routes');
  expect(res.status).toBe(200);
  expect(res.data.length).toBe(3);
  expect(res.data[0].number).toBe('12A');
});

test('returns bus position for a route', async () => {
  const res = await get('/routes/1/bus');
  expect(res.status).toBe(200);
  expect(res.data.busIndex).toBeGreaterThanOrEqual(0);
  expect(res.data.busIndex).toBeLessThan(5);
});

test('returns 404 for unknown route', async () => {
  const res = await get('/routes/99/bus');
  expect(res.status).toBe(404);
});
