import React from 'react';
import {Search, BookOpen, Shuffle, Zap, House, Star} from 'lucide-react';

export const MobileBottomNavigation = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'landing', icon: Star, label: 'Welcome' },
        { id: 'future', icon: Zap, label: 'Future' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#111415]/95 backdrop-blur-lg border-t border-[#beb8ab]/20 z-50">
            <div className="flex justify-around items-center py-2 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-[#c3be9f] hover:bg-[#272927]'
                            }`}
                        >
                            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-[#c3be9f]'}`} />
                            <span className={`text-xs ${isActive ? 'text-white' : 'text-[#c3be9f]'}`}>
                            {item.label}
                          </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
