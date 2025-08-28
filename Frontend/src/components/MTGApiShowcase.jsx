
import React, { useState } from 'react';
import './MTGApiShowcase.css';
import {Navigation} from "./tabs/Navigation.jsx";
import {CardDisplay} from "./card/CardDisplay.jsx";
import {SideNavigation} from "./navigation/SideNavigation.jsx";
import {FutureTab} from "./tabs/FutureTab.jsx";
import {LandingTab} from "./tabs/LandingTab.jsx"; // Add this import
import {useIsMobile} from "../hooks/useIsMobile.jsx";
import {MobileBottomNavigation} from "./navigation/MobileBottomNavigation.jsx";

const MTGApiShowcase = () => {
  const [activeTab, setActiveTab] = useState('landing'); // Start with landing
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cardsToDisplay, setCardsToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  return (
      <div className="text-[#c3be9f] min-h-screen min-w-screen bg-gradient-to-br from-[#242727]-900 via-[#25292a]-900 to-[#242727]-900">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation - Full Width */}
          <div className="mb-6">
            <Navigation
                setIsMobileMenuOpen = {setIsMobileMenuOpen}
                isMobileMenuOpen = {isMobileMenuOpen}
                activeTab = {activeTab}
                setActiveTab = {setActiveTab}
                setCardsToDisplay={setCardsToDisplay}
                setIsLoading={setIsLoading}
            />

            {/* Content */}
            <div className="w-full">
              {isMobile ? (
                  <div className="pb-20">
                    <div className="w-full">
                      {activeTab === "future" && <FutureTab/>}
                      {activeTab === "landing" && <LandingTab/>}
                      {activeTab !== "future" && activeTab !== "landing" && cardsToDisplay && cardsToDisplay.length > 0 &&
                          <div className="flex-1">
                            <CardDisplay cards={cardsToDisplay} isLoading={isLoading}/>
                          </div>
                      }
                    </div>
                  </div>
              ):(
                  <div className="grid grid-cols-10 gap-6">
                    <div className="col-span-2">
                      <SideNavigation setActiveTab = {setActiveTab}/>
                    </div>
                    <div className="col-span-8">
                      {activeTab === "future" && <FutureTab/>}
                      {activeTab === "landing" && <LandingTab/>}
                      {activeTab !== "future" && activeTab !== "landing" && cardsToDisplay && cardsToDisplay.length > 0 &&
                          <div className="flex-1">
                            <CardDisplay cards={cardsToDisplay} isLoading={isLoading}/>
                          </div>}
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