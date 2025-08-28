import React from 'react';
import { Zap, BookOpen } from 'lucide-react';

export const CardDisplay = ({ cards, isLoading }) => {
    return (
        <>
            <div className="relative bg-gradient-to-br bg-[#111415]/95 rounded-xl p-6 shadow-2xl border border-[#beb8ab]-700">
                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
                        <div className="text-white text-lg">Loading...</div>
                        {/* Or add a spinner here */}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {cards && cards.map((card, index) => (
                        <div key={index} className="flex flex-col gap-4">
                            <div className="flex-shrink-0 flex flex-col gap-4">
                                {card.image_uris?.normal && (
                                    <img
                                        src={card.image_uris.normal}
                                        alt={card.name}
                                        className="w-full h-auto rounded-lg shadow-xl border border-[#beb8ab]"
                                    />
                                )}
                                <div>
                                    <h3 className="text-xl lg:text-2xl font-bold mb-2">{card.name}</h3>
                                    {card.oracle_text && (
                                        <div className="bg-[#272927] rounded-lg p-4">
                                            <p className="text-sm lg:text-base leading-relaxed">{card.oracle_text}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};