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

const Overlay = ({ isOpen, setIsOpen }) => (
    isOpen ? (
        <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
        />
    ) : null
);

export const Navigation = ({activeTab, setActiveTab, setCardsToDisplay}) => {


    const searchFeatures = useCardSearch();
    const randomFeatures = useRandomCard();
    const setFeatures = useSets();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'search':
                return <SearchTab {...searchFeatures} />;
            case 'sets':
                return <SetsTab {...setFeatures} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        switch(activeTab) {
            case 'search':
                setCardsToDisplay(searchFeatures.searchResults);
                break;
            case 'sets':
                setCardsToDisplay(setFeatures.setCards);
                break;
            default:
                setCardsToDisplay(null);
        }
    }, [activeTab, searchFeatures.searchResults, setFeatures.setCards]);

    return (
        <>
            <nav className="relative mb-8">
                {/* Desktop Menu */}
                    <div className="bg-[#111415]/95 rounded-xl p-6 shadow-lg w-full flex flex-col items-center">
                        <div className="mb-6 w-full">
                            {renderTabContent()}
                        </div>

                        <div className="p-1 inline-flex">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
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
                                    randomFeatures.handleRandomCard();
                                    setCardsToDisplay(randomFeatures.randomCard);
                                }}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200  hover:bg-[#272927] `}
                            >
                                <Shuffle className="w-4 h-4" />
                                Random Card
                            </button>
                        </div>
                    </div>
            </nav>
        </>
    )
}