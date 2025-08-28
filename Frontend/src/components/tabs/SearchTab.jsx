import {Search} from "lucide-react";
import React, { useRef, useEffect } from "react";

export const SearchTab = ({ searchTerm, setSearchTerm, handleSearch, handleAutocomplete,
                              autocompleteResults, setAutocompleteResults}) => {

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAutocompleteResults(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setAutocompleteResults]);

    return (
        <>
            <div className="relative w-full" ref={dropdownRef}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleAutocomplete(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(searchTerm);
                        }
                    }}
                    placeholder="Enter card name (e.g., Lightning Bolt)..."
                    className="w-full px-4 py-3 bg-[#242727]-900 rounded-lg border border-[#beb8ab] focus:border-purple-500 focus:outline-none"
                />
                <Search className="absolute right-3 top-3 w-5 h-5 " />

                {/* Autocomplete dropdown */}
                {autocompleteResults && autocompleteResults.data && autocompleteResults.data.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#272927] border border-[#beb8ab] rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                        {autocompleteResults.data.map((suggestion, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSearchTerm(suggestion);
                                    setAutocompleteResults(null);
                                    handleSearch(suggestion);
                                }}
                                className="px-4 py-3 text-left hover:bg-[#272927] cursor-pointer border-b border-[#beb8ab] last:border-b-0 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                            >
                                <span className="">{suggestion}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};