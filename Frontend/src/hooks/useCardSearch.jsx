// src/hooks/useCardSearch.js
import {useState} from "react";
import {mtgApi} from "../services/api.jsx";
import {useAutocomplete} from "./useAutocomplete.jsx";

export const useCardSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const autocompleteFeatures = useAutocomplete();

    const handleSearch = async (term, exact = false) => {
        if (!term.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const result = await mtgApi.getCardByName(term, exact);
            setSearchResults(result);
        } catch (err) {
            setError('Failed to fetch card data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        searchTerm,
        setSearchTerm,
        searchResults,
        loading,
        error,
        handleSearch,
        ...autocompleteFeatures
    };
};