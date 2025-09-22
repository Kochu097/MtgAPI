// src/services/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.magic-finder.com/api';

export const mtgApi = {
    async makeRequest(endpoint) {
        const response = await fetch(`${API_BASE}${endpoint}`);
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
        mtgApi.makeRequest(`/getCardsBySet?setcode=${encodeURIComponent(setCode)}`)
};