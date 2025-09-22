import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const AdModal = ({ isOpen, onAdComplete, onSkip }) => {
    const [timeLeft, setTimeLeft] = useState(15); // 15 second ad
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [canSkip, setCanSkip] = useState(false);
    const [adEnded, setAdEnded] = useState(false);

    // Mock ad data - replace with real ad content
    const adData = {
        title: "Premium MTG Deck Builder",
        description: "Upgrade to unlock instant deck generation!",
        videoUrl: "/api/ads/video", // Replace with actual ad video
        imageUrl: "https://via.placeholder.com/640x360/1a1b1c/beb8ab?text=MTG+Ad",
        ctaText: "Learn More",
        ctaUrl: "#premium"
    };

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(15);
            setIsPlaying(true);
            setCanSkip(false);
            setAdEnded(false);
            return;
        }

        if (timeLeft > 0 && isPlaying) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            // Allow skipping after 5 seconds
            if (timeLeft <= 10) {
                setCanSkip(true);
            }

            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setAdEnded(true);
        }
    }, [isOpen, timeLeft, isPlaying]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleSkip = () => {
        if (canSkip || adEnded) {
            onSkip();
        }
    };

    const handleAdComplete = () => {
        onAdComplete();
    };

    const handleCTAClick = () => {
        window.open(adData.ctaUrl, '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111415] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-[#beb8ab]/20">
                {/* Ad Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#333]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-[#999]">Advertisement</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[#beb8ab]">
                            {adEnded ? "Ad Complete" : `${timeLeft}s remaining`}
                        </span>
                        {(canSkip || adEnded) && (
                            <button
                                onClick={handleSkip}
                                className="flex items-center gap-1 text-sm text-[#beb8ab] hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Skip
                            </button>
                        )}
                    </div>
                </div>

                {/* Ad Content */}
                <div className="relative">
                    {/* Video/Image Container */}
                    <div className="relative bg-[#1a1b1c] aspect-video">
                        <img
                            src={adData.imageUrl}
                            alt={adData.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePlayPause}
                                        className="text-white hover:text-[#beb8ab] transition-colors"
                                    >
                                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                    </button>
                                    <button
                                        onClick={handleMute}
                                        className="text-white hover:text-[#beb8ab] transition-colors"
                                    >
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="flex-1 mx-4">
                                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#beb8ab] transition-all duration-1000 ease-linear"
                                            style={{
                                                width: `${((15 - timeLeft) / 15) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <span className="text-white text-sm font-mono">
                                    {Math.floor((15 - timeLeft) / 60)}:{String((15 - timeLeft) % 60).padStart(2, '0')} / 0:15
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Ad Info */}
                    <div className="p-6 space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-[#c3be9f] mb-2">{adData.title}</h3>
                            <p className="text-[#999] leading-relaxed">{adData.description}</p>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleCTAClick}
                            className="w-full py-3 px-6 bg-gradient-to-r from-[#beb8ab] to-[#a39588] text-[#111415] font-semibold rounded-lg hover:from-[#a39588] hover:to-[#8f8376] transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            {adData.ctaText}
                        </button>

                        {/* Continue Button */}
                        {adEnded && (
                            <button
                                onClick={handleAdComplete}
                                className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                Continue to Deck Builder
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};