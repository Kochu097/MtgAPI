import { useState, useEffect } from 'react';
import { mtgApi } from '../services/api';

export const useSets = () => {
    // State for managing sets data
    const [allSets, setAllSets] = useState([]);        // Stores all available sets
    const [selectedSet, setSelectedSet] = useState(''); // Currently selected set
    const [setCards, setSetCards] = useState([]);      // Cards in the selected set
    const [loading, setLoading] = useState(false);      // Loading state
    const [error, setError] = useState(null);          // Error state

    // Load all sets when the component mounts
    useEffect(() => {
        loadSets();
    }, []);

    // Load cards when a set is selected
    useEffect(() => {
        if (selectedSet) {
            loadSetCards(selectedSet);
        }
    }, [selectedSet]);

    // Function to load all available sets
    const loadSets = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await mtgApi.getAllSets();
            // Sort sets alphabetically by name
            const sortedSets = result.sort((a, b) => a.name.localeCompare(b.name));
            setAllSets(sortedSets);
        } catch (err) {
            setError('Failed to load sets. Please try again.');
            console.error('Failed to load sets:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to load cards for a specific set
    const loadSetCards = async (setCode) => {
        if (!setCode) return;

        setLoading(true);
        setError(null);

        try {
            const result = await mtgApi.getCardsBySet(setCode);
            // Sort cards by name
            const sortedCards = result.sort((a, b) => a.name.localeCompare(b.name));
            setSetCards(sortedCards);
        } catch (err) {
            setError('Failed to load set cards. Please try again.');
            setSetCards([]);
        } finally {
            setLoading(false);
        }
    };
    // Return all the necessary values and functions
    return {
        selectedSet,
        setSelectedSet,
        allSets,
        setCards,
        loading,
    };

    //selectedSet, setSelectedSet, allSets, setCards
};