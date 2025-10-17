
const API_BASE = import.meta.env.VITE_API_AI_URL || 'https://mtgapi.onrender.com/ai';

export const aiApi = {
    async makeRequest(endpoint, authToken = null, options = {}){
        const headers = {
            'Content-Type': 'application/json',
        };
        // Add Authorization header if token is available
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const fetchOptions = {
            method: options.method || 'GET',
            headers: headers,
        };

        // Add body if provided
        if (options.body) {
            fetchOptions.body = JSON.stringify(options.body);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
}