import {Search} from "lucide-react";
import React from "react";
import {CardDisplay} from "../card/CardDisplay.jsx";
import {buttonStyles} from "../../styles/commonStyles.jsx";

export const SearchTab = ({ searchTerm, setSearchTerm, handleSearch, handleAutocomplete,
                              autocompleteResults, setAutocompleteResults, loading,
                              searchResults, error}) => {

    return (
        <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Search Cards</h2>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            handleAutocomplete(e.target.value);
                        }}
                        placeholder="Enter card name (e.g., Lightning Bolt)..."
                        className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    />
                    <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                </div>

                {autocompleteResults && autocompleteResults.data && autocompleteResults.data.length > 0 && (
                    <div className="mt-2 bg-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {autocompleteResults.data.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSearchTerm(suggestion);
                                    setAutocompleteResults(null);
                                    handleSearch(suggestion);
                                }}
                                className="w-full px-4 py-2 text-left text-white hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => handleSearch(searchTerm)}
                        disabled={loading}
                        className={buttonStyles.primary}
                    >
                        {loading ? 'Searching...' : 'Fuzzy Search'}
                    </button>
                    <button
                        onClick={() => handleSearch(searchTerm, true)}
                        disabled={loading}
                        className={buttonStyles.secondary}
                    >
                        Exact Search
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-600 text-white p-4 rounded-lg">
                    {error}
                </div>
            )}

            {searchResults && <CardDisplay card={searchResults} />}
        </div>
    );

};
