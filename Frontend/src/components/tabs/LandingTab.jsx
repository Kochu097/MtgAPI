import React from 'react';
import { Search, Shuffle, Filter, Heart, Coffee, Github } from 'lucide-react';

export const LandingTab = () => {
    return (
        <div className="relative bg-gradient-to-br bg-[#111415]/95 rounded-xl p-6 shadow-2xl border border-[#beb8ab]-700">
            {/* Hero Section */}
            <div className="text-center mb-8">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Magic Finder
                </h1>
                <p className="text-lg lg:text-xl text-[#c3be9f]/80 leading-relaxed">
                    Discover, explore, and find the perfect Magic: The Gathering cards with our powerful search engine
                </p>
            </div>

            {/* Features Grid - Same structure as CardDisplay */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="flex-shrink-0 flex flex-col gap-4">
                        <div className="p-4 bg-purple-600/20 rounded-lg w-fit mx-auto">
                            <Search className="w-12 h-12 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl lg:text-2xl font-bold mb-2 text-center">Advanced Search</h3>
                            <div className="bg-[#272927] rounded-lg p-4">
                                <p className="text-sm lg:text-base leading-relaxed text-center">
                                    Find cards by name, type, mana cost, abilities, and more. Our comprehensive search helps you discover exactly what you need.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex-shrink-0 flex flex-col gap-4">
                        <div className="p-4 bg-green-600/20 rounded-lg w-fit mx-auto">
                            <Shuffle className="w-12 h-12 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl lg:text-2xl font-bold mb-2 text-center">Random Discovery</h3>
                            <div className="bg-[#272927] rounded-lg p-4">
                                <p className="text-sm lg:text-base leading-relaxed text-center">
                                    Discover new cards and expand your knowledge with our random card feature. Perfect for inspiration and learning.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex-shrink-0 flex flex-col gap-4">
                        <div className="p-4 bg-orange-600/20 rounded-lg w-fit mx-auto">
                            <Filter className="w-12 h-12 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xl lg:text-2xl font-bold mb-2 text-center">Smart Filters</h3>
                            <div className="bg-[#272927] rounded-lg p-4">
                                <p className="text-sm lg:text-base leading-relaxed text-center">
                                    Use intelligent filters to narrow down your search by color, rarity, set, and format legality.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
                <h2 className="text-xl lg:text-2xl font-bold mb-4 text-center">Built for the Community</h2>
                <div className="bg-[#272927] rounded-lg p-4">
                    <p className="text-sm lg:text-base leading-relaxed text-center mb-4">
                        Magic Finder is a passion project created by and for Magic: The Gathering players.
                        Whether you're building your next deck, researching cards for a tournament, or just
                        exploring the vast multiverse of Magic, this tool is designed to make your journey easier and more enjoyable.
                    </p>
                    <p className="text-sm lg:text-base leading-relaxed text-center">
                        This project is completely free and open source. If you find it helpful and would like to
                        support its development, consider buying me a coffee to keep the servers running and new features coming!
                    </p>
                </div>
            </div>

            {/* Support Section */}
            <div className="text-center">
                <div className="p-6 bg-gradient-to-r from-purple-900/30 to-amber-900/30 rounded-lg border border-purple-500/20">
                    <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl lg:text-2xl font-bold mb-4">Support Magic Finder</h3>
                    <div className="bg-[#272927] rounded-lg p-4 mb-6">
                        <p className="text-sm lg:text-base leading-relaxed">
                            If you love using Magic Finder and want to help keep it running,
                            your support means the world to me! Every coffee helps maintain the servers and develop new features.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://buymeacoffee.com/Kochu097"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <Coffee className="w-5 h-5" />
                            Buy Me a Coffee
                        </a>

                        <a
                            href="https://github.com/Kochu097/MtgAPI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-[#272927] hover:bg-[#333639] rounded-lg text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <Github className="w-5 h-5" />
                            Star on GitHub
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#272927] text-center text-[#c3be9f]/60">
                <p className="mb-2 text-sm lg:text-base">
                    Made with ❤️ for the Magic: The Gathering community
                </p>
                <p className="text-xs lg:text-sm">
                    Magic: The Gathering is a trademark of Wizards of the Coast LLC
                </p>
            </div>
        </div>
    );
};