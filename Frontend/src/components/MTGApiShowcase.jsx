import React, { useState, useEffect } from 'react';
import { Search, Shuffle, Eye, Heart, Zap, BookOpen, Settings, Sparkles } from 'lucide-react';

const MTGApiShowcase = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState(null);
  const [randomCard, setRandomCard] = useState(null);
  const [allSets, setAllSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [setCards, setSetCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic API base URL based on environment
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mtgapi.onrender.com/api';

  // Helper function to make API calls with error handling
  const makeApiCall = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const handleSearch = async (term, exact = false) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = exact ? '/getCardByExactName' : '/getCardByName';
      const param = exact ? 'exactName' : 'name';
      const result = await makeApiCall(`${endpoint}?${param}=${encodeURIComponent(term)}`);
      setSearchResults(result);
    } catch (err) {
      setError('Failed to fetch card data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutocomplete = async (term) => {
    if (!term.trim()) {
      setAutocompleteResults(null);
      return;
    }
    
    try {
      const result = await makeApiCall(`/autocomplete?name=${encodeURIComponent(term)}`);
      setAutocompleteResults(result);
    } catch (err) {
      console.error('Autocomplete failed:', err);
      setAutocompleteResults(null);
    }
  };

  const handleRandomCard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await makeApiCall('/getRandomCard');
      setRandomCard(result);
    } catch (err) {
      setError('Failed to fetch random card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSets = async () => {
    try {
      const result = await makeApiCall('/getAllSets');
      setAllSets(result);
    } catch (err) {
      console.error('Failed to load sets:', err);
    }
  };

  const loadSetCards = async (setCode) => {
    if (!setCode) return;
    
    setLoading(true);
    try {
      const result = await makeApiCall(`/getCardsBySet?setcode=${encodeURIComponent(setCode)}`);
      setSetCards(result);
    } catch (err) {
      setError('Failed to load set cards. Please try again.');
      setSetCards(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, []);

  useEffect(() => {
    if (selectedSet) {
      loadSetCards(selectedSet);
    }
  }, [selectedSet]);

  const CardDisplay = ({ card }) => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-2xl border border-slate-700">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0">
          {card.image_uris?.normal && (
            <img 
              src={card.image_uris.normal} 
              alt={card.name}
              className="w-60 h-auto rounded-lg shadow-xl border border-slate-600"
            />
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{card.name}</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full">{card.type_line}</span>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-full capitalize">{card.rarity}</span>
              {card.mana_cost && (
                <span className="px-3 py-1 bg-orange-600 text-white rounded-full">{card.mana_cost}</span>
              )}
            </div>
          </div>
          
          {card.oracle_text && (
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-200 leading-relaxed">{card.oracle_text}</p>
            </div>
          )}
          
          <div className="flex items-center gap-6 text-sm text-slate-300">
            {card.power && card.toughness && (
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>{card.power}/{card.toughness}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{card.set_name}</span>
            </div>
          </div>
          
          {card.prices && (
            <div className="flex gap-4 text-sm">
              <div className="px-3 py-1 bg-green-600 text-white rounded">
                Regular: ${card.prices.usd}
              </div>
              {card.prices.usd_foil && (
                <div className="px-3 py-1 bg-yellow-600 text-white rounded">
                  Foil: ${card.prices.usd_foil}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'search', label: 'Card Search', icon: Search },
    { id: 'random', label: 'Random Card', icon: Shuffle },
    { id: 'sets', label: 'Browse Sets', icon: BookOpen },
    { id: 'future', label: 'Future Features', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔮 MTG API Showcase
          </h1>
          <p className="text-slate-300 text-lg">
            Explore Magic: The Gathering cards with powerful API endpoints
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8">
          <div className="bg-slate-800 rounded-xl p-1 shadow-lg">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
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
        </nav>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Search Cards</h2>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleAutocomplete(e.target.value);
                    }}
                    placeholder="Enter card name (e.g., Lightning Bolt)..."
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                  />
                  <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                </div>
                
                {autocompleteResults && autocompleteResults.data && autocompleteResults.data.length > 0 && (
                  <div className="mt-2 bg-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {autocompleteResults.data.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchTerm(suggestion);
                          setAutocompleteResults(null);
                          handleSearch(suggestion);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleSearch(searchTerm)}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Searching...' : 'Fuzzy Search'}
                  </button>
                  <button
                    onClick={() => handleSearch(searchTerm, true)}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    Exact Search
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-600 text-white p-4 rounded-lg">
                  {error}
                </div>
              )}

              {searchResults && <CardDisplay card={searchResults} />}
            </div>
          )}

          {activeTab === 'random' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Random Card Generator</h2>
                <p className="text-slate-300 mb-6">
                  Discover new cards with our random card endpoint!
                </p>
                <button
                  onClick={handleRandomCard}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Shuffle className="w-5 h-5" />
                    {loading ? 'Generating...' : 'Get Random Card'}
                  </div>
                </button>
              </div>

              {randomCard && <CardDisplay card={randomCard} />}
            </div>
          )}

          {activeTab === 'sets' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Browse Sets</h2>
                <select
                  value={selectedSet}
                  onChange={(e) => setSelectedSet(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select a set...</option>
                  {allSets.map(set => (
                    <option key={set.code} value={set.code}>
                      {set.name} ({set.code})
                    </option>
                  ))}
                </select>
              </div>

              {setCards != null && setCards.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Cards in Set ({setCards.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {setCards.map((card, index) => (
                      <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer">
                        <h4 className="text-white font-semibold mb-2">{card.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            card.rarity === 'common' ? 'bg-gray-600' :
                            card.rarity === 'uncommon' ? 'bg-green-600' :
                            card.rarity === 'rare' ? 'bg-yellow-600' : 'bg-purple-600'
                          } text-white`}>
                            {card.rarity}
                          </span>
                          {card.cmc !== undefined && (
                            <span className="text-slate-400 text-sm">CMC: {card.cmc}</span>
                          )}
                        </div>
                        {card.type_line && (
                          <p className="text-slate-300 text-sm">{card.type_line}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'future' && (
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white mb-4">🚀 Coming Soon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-purple-700 to-blue-700 rounded-lg p-6">
                  <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">AI Deck Builder</h3>
                  <p className="text-purple-100">
                    Intelligent deck building with AI-powered card recommendations and synergy analysis
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-700 to-blue-700 rounded-lg p-6">
                  <Heart className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Collection Tracker</h3>
                  <p className="text-green-100">
                    Track your card collection, wishlist, and portfolio value over time
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MTGApiShowcase;