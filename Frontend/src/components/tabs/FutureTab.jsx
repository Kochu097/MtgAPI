import {Heart, Sparkles} from "lucide-react";
import React from "react";

export const FutureTab = () => {
    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-purple-700 to-blue-700 rounded-lg p-6">
                    <Sparkles className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">AI Deck Builder</h3>
                    <p className="text-purple-100">
                        Intelligent deck building with AI-powered card recommendations and synergy analysis
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-700 to-blue-700 rounded-lg p-6">
                    <Heart className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Collection Tracker</h3>
                    <p className="text-green-100">
                        Track your card collection, wishlist, and portfolio value over time
                    </p>
                </div>
            </div>
        </div>
    )
}