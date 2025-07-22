import {Menu, X} from "lucide-react";
import {MobileMenu} from "../navigation/MobileMenu.jsx";
import React from "react";
import {TABS} from "../../constants/tabs.js";

const Overlay = ({ isOpen, setIsOpen }) => (
    isOpen ? (
        <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
        />
    ) : null
);

export const Navigation = ({setIsMobileMenuOpen, isMobileMenuOpen, activeTab, setActiveTab}) => {
    return (
        <nav className="relative mb-8">
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex justify-end mb-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Overlay */}
            <Overlay isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            {/* Mobile Menu Dropdown */}
            <MobileMenu
                tabs={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
            />

            {/* Desktop Menu */}
            <div className="hidden lg:flex justify-center">
                <div className="bg-slate-800 rounded-xl p-1 shadow-lg inline-flex">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    )
}