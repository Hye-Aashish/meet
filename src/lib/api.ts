/**
 * Centralized API utility for Nexus Meeting Portal
 * Handles authentication headers and consistent error handling
 */

export const getAuthToken = () => localStorage.getItem('nexus_token');

export const api = {
    async fetch(url: string, options: RequestInit = {}) {
        const token = getAuthToken();
        const headers = {
            ...options.headers,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Content-Type': options.body instanceof FormData ? undefined : 'application/json',
        };

        // Note: fetch will fail if Content-Type is set manually for FormData
        if (options.body instanceof FormData) {
            delete (headers as any)['Content-Type'];
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            // Token expired or invalid
            localStorage.clear();
            window.location.href = '/login';
            throw new Error('Session expired');
        }

        return response;
    },

    async get(url: string) {
        return this.fetch(url, { method: 'GET' });
    },

    async post(url: string, body: any) {
        return this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    async put(url: string, body: any) {
        return this.fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    async delete(url: string) {
        return this.fetch(url, { method: 'DELETE' });
    }
};
