import client from 'prom-client';

export const register = client.register;

// Clear the register to prevent "A metric with the name X has already been registered" during hot reloads
register.clear();

client.collectDefaultMetrics({ register });

export const httpRequestsTotal = new client.Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'route', 'status']
});

export const httpRequestDurationSeconds = new client.Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in seconds',
	labelNames: ['method', 'route', 'status'],
	buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
