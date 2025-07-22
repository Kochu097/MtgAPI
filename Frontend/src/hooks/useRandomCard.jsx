import {useState} from "react";
import {mtgApi} from "../services/api.jsx";

export const useRandomCard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [randomCard, setRandomCard] = useState(null);

    const handleRandomCard = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await mtgApi.getRandomCard();
            setRandomCard(result);
        } catch (err) {
            setError('Failed to fetch random card. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        randomCard,
        loading,
        handleRandomCard
    };
};