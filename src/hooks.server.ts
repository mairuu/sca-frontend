import type { Handle } from '@sveltejs/kit';
import { httpRequestsTotal, httpRequestDurationSeconds } from '$lib/metrics';

export const handle: Handle = async ({ event, resolve }) => {
    // Determine route for labels. Fallback to 'unknown' if not mapped
    const route = event.route.id || 'unknown';
    const method = event.request.method;

    // Do not record metrics for the metrics endpoint itself
    if (route === '/metrics') {
        return await resolve(event);
    }

    const endTimer = httpRequestDurationSeconds.startTimer();
    
    // Resolve the request
    const response = await resolve(event);
    
    const status = response.status.toString();

    httpRequestsTotal.labels(method, route, status).inc();
    endTimer({ method, route, status });
    
    return response;
};
