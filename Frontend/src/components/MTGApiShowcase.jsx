import React, { useState } from 'react';
import './MTGApiShowcase.css';
import {Navigation} from "./tabs/Navigation.jsx";
import {CardDisplay} from "./card/CardDisplay.jsx";

const MTGApiShowcase = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cardsToDisplay, setCardsToDisplay] = useState([]);


  return (
      <div className="text-[#c3be9f] min-h-screen min-w-screen bg-gradient-to-br from-[#242727]-900 via-[#25292a]-900 to-[#242727]-900">
        <div className="container mx-auto px-4 py-8">


          {/* Content */}
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Navigation - Desktop and Mobile */}
            <Navigation
                setIsMobileMenuOpen = {setIsMobileMenuOpen}
                isMobileMenuOpen = {isMobileMenuOpen}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                setCardsToDisplay={setCardsToDisplay}
            />
            {cardsToDisplay && cardsToDisplay.length>0 && <CardDisplay cards={cardsToDisplay} />}

            {/*
            search tab
            navigation
            result
            */}
          </div>
      </div>
    </div>
  );
};

export default MTGApiShowcase;