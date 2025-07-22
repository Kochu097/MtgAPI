// src/components/card/CardDisplay.jsx
import React from 'react';
import { Zap, BookOpen } from 'lucide-react';

export const CardDisplay = ({ card }) => {
    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-2xl border border-slate-700">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                    {card.image_uris?.normal && (
                        <img
                            src={card.image_uris.normal}
                            alt={card.name}
                            className="w-60 h-auto rounded-lg shadow-xl border border-slate-600"
                        />
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{card.name}</h3>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-full">{card.type_line}</span>
                            <span className="px-3 py-1 bg-purple-600 text-white rounded-full capitalize">{card.rarity}</span>
                            {card.mana_cost && (
                                <span className="px-3 py-1 bg-orange-600 text-white rounded-full">{card.mana_cost}</span>
                            )}
                        </div>
                    </div>

                    {card.oracle_text && (
                        <div className="bg-slate-700 rounded-lg p-4">
                            <p className="text-slate-200 leading-relaxed">{card.oracle_text}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-slate-300">
                        {card.power && card.toughness && (
                            <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                <span>{card.power}/{card.toughness}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{card.set_name}</span>
                        </div>
                    </div>

                    {card.prices && (
                        <div className="flex gap-4 text-sm">
                            <div className="px-3 py-1 bg-green-600 text-white rounded">
                                Regular: ${card.prices.usd}
                            </div>
                            {card.prices.usd_foil && (
                                <div className="px-3 py-1 bg-yellow-600 text-white rounded">
                                    Foil: ${card.prices.usd_foil}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// src/components/navigation/MobileMenu.jsx
