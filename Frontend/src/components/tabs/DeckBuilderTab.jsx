import React, { useState } from 'react';
import { Wand2, Palette, Clock, DollarSign, Sparkles } from 'lucide-react';
import { CardDisplay } from '../card/CardDisplay.jsx';
import {useCreateNewDeck} from "../../hooks/useCreateNewDeck.jsx";

export const DeckBuilderTab = () => {
    const [formData, setFormData] = useState({
        format: '',
        colors: [],
        playstyle: '',
        budget: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { handleCreateNewDeck, deckData } = useCreateNewDeck();

    const playstyles = [
        { value: 'Aggro', label: 'Aggro', description: 'Fast, aggressive strategy' },
        { value: 'Control', label: 'Control', description: 'Late game dominance' },
        { value: 'Midrange', label: 'Midrange', description: 'Balanced approach' },
        { value: 'Combo', label: 'Combo', description: 'Synergistic interactions' },
        { value: 'Ramp', label: 'Ramp', description: 'Accelerate to big plays' },
        { value: 'Tempo', label: 'Tempo', description: 'Efficient pressure' }
    ];

    const colors = [
        { value: 'White', label: 'White', color: '#FFFBD5' },
        { value: 'Blue', label: 'Blue', color: '#0E68AB' },
        { value: 'Black', label: 'Black', color: '#150B00' },
        { value: 'Red', label: 'Red', color: '#D3202A' },
        { value: 'Green', label: 'Green', color: '#00733E' }
    ];

    const playFormats = [
        { value: 'Standard', label: 'Standard', description: 'Current rotation' },
        { value: 'Modern', label: 'Modern', description: 'Extended card pool' },
        { value: 'Commander', label: 'Commander', description: '100-card singleton' },
        { value: 'Legacy', label: 'Legacy', description: 'Eternal format' },
        { value: 'Vintage', label: 'Vintage', description: 'All cards allowed' },
        { value: 'Pioneer', label: 'Pioneer', description: 'Return to Ravnica+' }
    ];

    const budgetOptions = [
        { value: 'Budget', label: 'Budget', description: 'Under $50', icon: '💰' },
        { value: 'Moderate', label: 'Moderate', description: '$50 - $150', icon: '💳' },
        { value: 'Competitive', label: 'Competitive', description: '$150 - $300', icon: '🏆' },
        { value: 'Premium', label: 'Premium', description: '$300+', icon: '💎' }
    ];

    const handleColorToggle = (colorValue) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.includes(colorValue)
                ? prev.colors.filter(c => c !== colorValue)
                : [...prev.colors, colorValue]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsLoading(true);
        await handleCreateNewDeck(formData);
        setIsLoading(false);

    };

    const isFormValid = formData.playstyle && formData.colors.length > 0 && formData.format && formData.budget;

    return (
        <div className="space-y-6">
            <div className="bg-[#111415]/95 rounded-xl p-6 shadow-lg border border-[#beb8ab]/20">
                <div className="flex items-center gap-3 mb-6">
                    <Wand2 className="w-6 h-6 text-[#beb8ab]" />
                    <h2 className="text-2xl font-bold text-[#c3be9f]">MTG Deck Builder</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Playstyle Selection */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-[#beb8ab]" />
                            <h3 className="text-lg font-semibold text-[#c3be9f]">Choose Your Playstyle</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {playstyles.map((style) => (
                                <label
                                    key={style.value}
                                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:bg-[#1a1b1c] ${
                                        formData.playstyle === style.value
                                            ? 'border-[#beb8ab] bg-[#1a1b1c]'
                                            : 'border-[#333] hover:border-[#555]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="playstyle"
                                        value={style.value}
                                        checked={formData.playstyle === style.value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, playstyle: e.target.value }))}
                                        className="sr-only"
                                    />
                                    <div className="font-medium text-[#c3be9f]">{style.label}</div>
                                    <div className="text-sm text-[#999] mt-1">{style.description}</div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Palette className="w-5 h-5 text-[#beb8ab]" />
                            <h3 className="text-lg font-semibold text-[#c3be9f]">Select Colors</h3>
                            <span className="text-sm text-[#999]">({formData.colors.length} selected)</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color) => (
                                <label
                                    key={color.value}
                                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                                        formData.colors.includes(color.value)
                                            ? 'border-[#beb8ab] bg-[#1a1b1c] scale-105'
                                            : 'border-[#333] hover:border-[#555]'
                                    }`}
                                    style={{
                                        backgroundColor: formData.colors.includes(color.value)
                                            ? `${color.color}20`
                                            : undefined
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.colors.includes(color.value)}
                                        onChange={() => handleColorToggle(color.value)}
                                        className="sr-only"
                                    />
                                    <div
                                        className="w-6 h-6 rounded-full mx-auto mb-2 border-2 border-white/20"
                                        style={{ backgroundColor: color.color }}
                                    />
                                    <div className="text-center font-medium text-[#c3be9f]">{color.label}</div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Play Format */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#beb8ab]" />
                            <h3 className="text-lg font-semibold text-[#c3be9f]">Play Format</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {playFormats.map((format) => (
                                <label
                                    key={format.value}
                                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:bg-[#1a1b1c] ${
                                        formData.format === format.value
                                            ? 'border-[#beb8ab] bg-[#1a1b1c]'
                                            : 'border-[#333] hover:border-[#555]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="playFormat"
                                        value={format.value}
                                        checked={formData.format === format.value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                                        className="sr-only"
                                    />
                                    <div className="font-medium text-[#c3be9f]">{format.label}</div>
                                    <div className="text-sm text-[#999] mt-1">{format.description}</div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Budget Options */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-5 h-5 text-[#beb8ab]" />
                            <h3 className="text-lg font-semibold text-[#c3be9f]">Budget Range</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {budgetOptions.map((budget) => (
                                <label
                                    key={budget.value}
                                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:bg-[#1a1b1c] ${
                                        formData.budget === budget.value
                                            ? 'border-[#beb8ab] bg-[#1a1b1c]'
                                            : 'border-[#333] hover:border-[#555]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="budget"
                                        value={budget.value}
                                        checked={formData.budget === budget.value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                                        className="sr-only"
                                    />
                                    <div className="text-center text-2xl mb-2">{budget.icon}</div>
                                    <div className="font-medium text-[#c3be9f] text-center">{budget.label}</div>
                                    <div className="text-sm text-[#999] mt-1 text-center">{budget.description}</div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                                isFormValid && !isLoading
                                    ? 'bg-gradient-to-r from-[#beb8ab] to-[#a39588] text-[#111415] hover:from-[#a39588] hover:to-[#8f8376] transform hover:scale-[1.02] shadow-lg'
                                    : 'bg-[#333] text-[#666] cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Generating Deck...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" />
                                    Generate My Deck
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            {deckData && deckData.deck && (
                <CardDisplay cards={deckData.deck} isLoading={isLoading} />
            )}
        </div>
    );
};