// src/services/api.js
import {useAuth} from "../contexts/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mtgapi.onrender.com/api';
const { authToken } = useAuth();

export const mtgApi = {
    async makeRequest(endpoint) {
        const headers = {
            'Content-Type': 'application/json',
        };
        // Add Authorization header if token is available
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: headers,
        });
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