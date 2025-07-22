import {useState} from "react";
import {mtgApi} from "../services/api.jsx";

export const useAutocomplete = () => {


    const [autocompleteResults, setAutocompleteResults] = useState(null);
    const handleAutocomplete = async (term) => {
        if (!term.trim()) {
            setAutocompleteResults(null);
            return;
        }

        try {
            const result = await mtgApi.getAutocomplete(term);
            setAutocompleteResults(result);
        } catch (err) {
            console.error('Autocomplete failed:', err);
            setAutocompleteResults(null);
        }
    };

    return {
        autocompleteResults,
        setAutocompleteResults,
        handleAutocomplete,
    };
}