import React, { useState } from 'react';
import './MTGApiShowcase.css';
import {SearchTab} from "./tabs/SearchTab.jsx";
import {RandomTab} from "./tabs/RandomTab.jsx";
import {SetsTab} from "./tabs/SetsTab.jsx";
import {FutureTab} from "./tabs/FutureTab.jsx";
import {Navigation} from "./tabs/Navigation.jsx";
import {useCardSearch} from "../hooks/useCardSearch.jsx";
import {useRandomCard} from "../hooks/useRandomCard.jsx";
import {useSets} from "../hooks/useSets.jsx";

const MTGApiShowcase = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchFeatures = useCardSearch();
  const randomFeatures = useRandomCard();
  const setFeatures = useSets();


  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return <SearchTab {...searchFeatures} />;
      case 'random':
        return <RandomTab {...randomFeatures} />;
      case 'sets':
        return <SetsTab {...setFeatures} />;
      case 'future':
        return <FutureTab/>;
      default:
        return null;
    }
  };


  return (
      <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8 relative">
            <h1 className="text-4xl font-bold text-white mb-2">
              🔮 MTG API Showcase
            </h1>
            <p className="text-slate-300 text-lg">
              Explore Magic: The Gathering cards with powerful API endpoints
            </p>
          </header>


          {/* Content */}
        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
          {/* Navigation - Desktop and Mobile */}
          <Navigation
              setIsMobileMenuOpen = {setIsMobileMenuOpen}
              isMobileMenuOpen = {isMobileMenuOpen}
              activeTab = {activeTab}
              setActiveTab = {setActiveTab}
          />
      </div>
    </div>
  );
};

export default MTGApiShowcase;