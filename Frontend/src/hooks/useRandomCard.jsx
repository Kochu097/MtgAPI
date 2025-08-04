import {useState} from "react";
import {mtgApi} from "../services/api.jsx";

export const useRandomCard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [randomCard, setRandomCard] = useState([]);

    const handleRandomCard = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching random card...');
            const result = await mtgApi.getRandomCard();
            setRandomCard([result]);
        } catch (err) {
            setError('Failed to fetch random card. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleRandomCard,
        randomCard
    };
};