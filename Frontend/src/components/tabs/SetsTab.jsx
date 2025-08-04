import React from "react";
import {Navigation} from "./Navigation.jsx";

export const SetsTab = ({selectedSet, setSelectedSet, allSets, setCards}) => {
    return (
        <>
            <select
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            >
                <option value="">Select a set...</option>
                {allSets.map(set => (
                    <option key={set.code} value={set.code}>
                        {set.name} ({set.code})
                    </option>
                ))}
            </select>

            {/*{setCards != null && setCards.length > 0 && (*/}
            {/*    <div className="bg-slate-800 rounded-xl p-6 shadow-lg">*/}
            {/*        <h3 className="text-xl font-bold mb-4">Cards in Set ({setCards.length})</h3>*/}
            {/*        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">*/}
            {/*            {setCards.map((card, index) => (*/}
            {/*                <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer">*/}
            {/*                    <h4 className="font-semibold mb-2">{card.name}</h4>*/}
            {/*                    <div className="flex items-center gap-2 mb-2">*/}
            {/*              <span className={`px-2 py-1 rounded text-xs ${*/}
            {/*                  card.rarity === 'common' ? 'bg-gray-600' :*/}
            {/*                      card.rarity === 'uncommon' ? 'bg-green-600' :*/}
            {/*                          card.rarity === 'rare' ? 'bg-yellow-600' : 'bg-purple-600'*/}
            {/*              } `}>*/}
            {/*                {card.rarity}*/}
            {/*              </span>*/}
            {/*                        {card.cmc !== undefined && (*/}
            {/*                            <span className="text-slate-400 text-sm">CMC: {card.cmc}</span>*/}
            {/*                        )}*/}
            {/*                    </div>*/}
            {/*                    {card.type_line && (*/}
            {/*                        <p className="text-slate-300 text-sm">{card.type_line}</p>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </>
    )
}