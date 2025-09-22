import React from "react";

export const SetsTab = ({selectedSet, setSelectedSet, allSets, setCards}) => {
    return (
        <>

            <nav className="relative mb-8">
                <div className="bg-[#111415]/95 rounded-xl p-6 shadow-lg w-full items-center border border-[#beb8ab]-700">
                    <div className="mb-1 col-span-1 flex items-center justify-start px-2">
                        <select
                            value={selectedSet}
                            onChange={(e) => setSelectedSet(e.target.value)}
                            className="w-full px-4 py-3 bg-[#272927] rounded-lg border border-[#beb8ab] focus:border-purple-500 focus:outline-none"
                        >
                            <option value="">Select a set...</option>
                            {allSets.map(set => (
                                <option key={set.code} value={set.code}>
                                    {set.name} ({set.code})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </nav>
        </>
    )
}