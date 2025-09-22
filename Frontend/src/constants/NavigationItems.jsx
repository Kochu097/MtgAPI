import {Package, Plus, Search, Star, Zap} from "lucide-react";

export const NavigationItems = [
    {
        id: 'landing',
        label: 'Welcome',
        icon: Star,
    },
    {
        id: 'deckBuilder',
        label: 'Deck builder',
        icon: Plus
    },
    {
        id: 'search',
        label: 'Search',
        icon: Search
    },
    {
        id: 'sets',
        label: 'Sets',
        icon: Package
    },
    {
        id: 'future',
        label: 'Future releases',
        icon: Zap,
    },
];