
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mtgapi.onrender.com/api';
const API_AI_BASE = import.meta.env.VITE_API_AI_URL || 'https://mtgapi.onrender.com/ai';

export const mtgApi = {
    async makeRequest(endpoint, authToken = null, body = null, baseUrl = API_BASE, method = 'GET'){
        const headers = {
            'Content-Type': 'application/json',
        };
        // Add Authorization header if token is available
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const fetchOptions = {
            method: method,
            headers: headers,
        };

        // Add body if provided
        if (body) {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    getCardByName: (name, exact = false) => {
        const endpoint = exact ? '/getCardByExactName' : '/getCardByName';
        const param = exact ? 'exactName' : 'name';
        return mtgApi.makeRequest(`${endpoint}?${param}=${encodeURIComponent(name)}`);
    },

    getAutocomplete: (term) =>
        mtgApi.makeRequest(`/autocomplete?name=${encodeURIComponent(term)}`),

    getRandomCard: () =>
        mtgApi.makeRequest('/getRandomCard'),

    getAllSets: () =>
        mtgApi.makeRequest('/getAllSets'),

    getCardsBySet: (setCode) =>
        mtgApi.makeRequest(`/getCardsBySet?setcode=${encodeURIComponent(setCode)}`),

    createNewDeck: (deckData, authToken) =>
        mtgApi.makeRequest(`/createNewDeck`, authToken, deckData, API_AI_BASE, 'POST')
};