import {BookOpen, Menu, Shuffle, X} from "lucide-react";
import {MobileMenu} from "../navigation/MobileMenu.jsx";
import React, {useEffect} from "react";
import {TABS} from "../../constants/tabs.js";
import {SearchTab} from "./SearchTab.jsx";
import {useCardSearch} from "../../hooks/useCardSearch.jsx";
import {useRandomCard} from "../../hooks/useRandomCard.jsx";
import {useSets} from "../../hooks/useSets.jsx";
import {RandomTab} from "./RandomTab.jsx";
import {SetsTab} from "./SetsTab.jsx";
import {FutureTab} from "./FutureTab.jsx";

const Overlay = ({ isOpen, setIsOpen }) => (
    isOpen ? (
        <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
        />
    ) : null
);

export const Navigation = ({activeTab, setActiveTab, setCardsToDisplay, setIsLoading}) => {

    const searchFeatures = useCardSearch();
    const randomFeatures = useRandomCard();
    const setFeatures = useSets();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'landing':
                return <SearchTab {...searchFeatures} />;
            case 'search':
                setIsLoading(searchFeatures.loading);
                return <SearchTab {...searchFeatures} />;
            case 'sets':
                setIsLoading(setFeatures.loading);
                return <SetsTab {...setFeatures} />;
            default:
                setIsLoading(searchFeatures.loading);
                return <SearchTab {...searchFeatures} />;
        }
    };

    useEffect(() => {
        switch(activeTab) {
            case 'landing':
                setCardsToDisplay([]);
                break;
            case 'search':
                setCardsToDisplay(searchFeatures.searchResults);
                break;
            case 'sets':
                setCardsToDisplay(setFeatures.setCards);
                break;
            case 'random':
                setCardsToDisplay(randomFeatures.randomCard);
                break;
            default:
                setCardsToDisplay(null);
        }
    }, [activeTab, searchFeatures.searchResults, setFeatures.setCards, randomFeatures.randomCard, setCardsToDisplay]);

    return (
        <>
            <nav className="relative mb-8">
                <div className="bg-[#111415]/95 rounded-xl p-6 shadow-lg w-full items-center grid grid-rows-2 min-h-40">
                    <div className="mb-1 col-span-1 flex items-center justify-start px-2">
                        {renderTabContent()}
                    </div>

                    <div className="w-full overflow-x-auto">
                        <div className="p-1 flex justify-start items-center gap-2 min-w-max px-2">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? 'bg-purple-600 shadow-lg'
                                                : ' hover:bg-[#272927]'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => {
                                    setIsLoading(randomFeatures.loading);
                                    randomFeatures.handleRandomCard();
                                    setActiveTab("random")
                                }}
                                className={`whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200  hover:bg-[#272927] `}
                            >
                                <Shuffle className="w-4 h-4" />
                                Random Card
                            </button>
                        </div>
                    </div>

                </div>
            </nav>
        </>
    )
}