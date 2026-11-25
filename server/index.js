const http = require('http');
const routes = require('../src/routes.json');

const PORT = process.env.PORT || 4000;
const STOP_TIME = 5000;
const startTime = Date.now();

function getBusIndex(route) {
  return Math.floor((Date.now() - startTime) / STOP_TIME) % route.stops.length;
}

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.url === '/routes') {
    return send(res, 200, routes);
  }

  const match = req.url.match(/^\/routes\/(\w+)\/bus$/);
  const route = match && routes.find((item) => item.id === match[1]);

  if (route) {
    return send(res, 200, { busIndex: getBusIndex(route) });
  }

  send(res, 404, { error: 'Not found' });
});

if (require.main === module) {
  server.listen(PORT, () => console.log('Bus server running on port ' + PORT));
}

module.exports = server;
