import { env } from '$env/dynamic/public';

export const apiBase = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';
export const cdnBase = env.PUBLIC_CDN_BASE_URL || 'http://localhost:9000/mp-api-public';
