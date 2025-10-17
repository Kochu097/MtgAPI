import {useState} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";
import {mtgApi} from "../services/api.jsx";

export const useCreateNewDeck = () => {
    const [deckData, setDeckData] = useState(null);
    const [loading, setLoading] = useState(false);
    const {authToken} = useAuth()

    const handleCreateNewDeck = async (deckData) => {
        setLoading(true);

        try {
            var result = await mtgApi.createNewDeck(deckData, authToken);
            setDeckData(result);
        } catch(err) {
            console.error('Failed to create new deck:', err);
        } finally {
            setLoading(false);
        }
    }

    return {
        deckData,
        loading,
        handleCreateNewDeck
    };

};