
import React, {useEffect, useState} from 'react';
import './MTGApiShowcase.css';
import {CardDisplay} from "./card/CardDisplay.jsx";
import {SideNavigation} from "./navigation/SideNavigation.jsx";
import {FutureTab} from "./tabs/FutureTab.jsx";
import {LandingTab} from "./tabs/LandingTab.jsx";
import {useIsMobile} from "../hooks/useIsMobile.jsx";
import {MobileBottomNavigation} from "./navigation/MobileBottomNavigation.jsx";
import {SearchTab} from "./tabs/SearchTab.jsx";
import {useCardSearch} from "../hooks/useCardSearch.jsx";
import {useRandomCard} from "../hooks/useRandomCard.jsx";
import {useSets} from "../hooks/useSets.jsx";
import {SetsTab} from "./tabs/SetsTab.jsx";
import {DeckBuilderTab} from "./tabs/DeckBuilderTab.jsx";

const MTGApiShowcase = () => {
    const [activeTab, setActiveTab] = useState('landing'); // Start with landing
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cardsToDisplay, setCardsToDisplay] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = useIsMobile();
    const searchFeatures = useCardSearch();
    const randomFeatures = useRandomCard();
    const setFeatures = useSets();

    useEffect(() => {
        switch(activeTab) {
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


    const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingTab/>;
      case 'future':
        return <FutureTab/>;
      case 'deckBuilder':
        return <DeckBuilderTab/>;
      case 'search':
        return (
            <div className="flex-1">
                <SearchTab {...searchFeatures} />
                {cardsToDisplay && cardsToDisplay.length > 0 && <CardDisplay cards={cardsToDisplay} isLoading={isLoading}/>}
            </div>
        );
      case 'sets':
        return (
            <div className="flex-1">
                <SetsTab {...setFeatures} />
                {cardsToDisplay && cardsToDisplay.length > 0 && <CardDisplay cards={cardsToDisplay} isLoading={isLoading}/>}
            </div>
        );

    }
  }



  return (
      <div className="text-[#c3be9f] min-h-screen min-w-screen bg-gradient-to-br from-[#242727]-900 via-[#25292a]-900 to-[#242727]-900">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation - Full Width */}
          <div className="mb-6">

            {/* Content */}
            <div className="w-full">
              {isMobile ? (
                  <div className="pb-20">
                    <div className="w-full">
                      {renderContent()}
                    </div>
                  </div>
              ):(
                  <div className="grid grid-cols-10 gap-6">
                    <div className="col-span-2">
                      <SideNavigation setActiveTab = {setActiveTab}/>
                    </div>
                    <div className="col-span-8">
                      {renderContent()}
                    </div>
                  </div>
              )}
            </div>
          </div>

          {/* Mobile Bottom Navigation - Only show on mobile */}
          {isMobile && (
              <MobileBottomNavigation
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
              />
          )}

        </div>
      </div>
  );
};

export default MTGApiShowcase;