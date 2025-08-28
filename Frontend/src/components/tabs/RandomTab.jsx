import {Shuffle} from "lucide-react";
import {CardDisplay} from "../card/CardDisplay.jsx";
import React from "react";

export const RandomTab = ({ handleRandomCard, loading, randomCard }) => {
    return (
        <>
            <div className="bg-[#272927] rounded-xl p-6 shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Random Card Generator</h2>
                <p className=" mb-6">
                    Discover new cards with our random card endpoint!
                </p>
                <button
                    onClick={handleRandomCard}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                >
                    <div className="flex items-center gap-2">
                        <Shuffle className="w-5 h-5" />
                        {loading ? 'Generating...' : 'Get Random Card'}
                    </div>
                </button>
            </div>
        </>
    )
};
