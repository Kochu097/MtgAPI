import React from "react";
import {TABS} from "../../constants/tabs.js";

export const MobileMenu = ({activeTab, setActiveTab, isOpen, setIsOpen }) => {
    return (
        <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} fixed top-20 right-4 left-4 z-50`}>
            <div className="bg-slate-800 rounded-xl shadow-lg p-2 border border-slate-700">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-purple-600'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};