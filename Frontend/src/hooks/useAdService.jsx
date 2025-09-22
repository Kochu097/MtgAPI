import { useState, useCallback } from 'react';
import { googleAdService } from '../services/GoogleAdService.jsx';

export const useAdService = () => {
    const [showAd, setShowAd] = useState(false);
    const [pendingApiCall, setPendingApiCall] = useState(null);
    const [isLoadingAd, setIsLoadingAd] = useState(false);

    // Check if user should see an ad
    const shouldShowAd = useCallback(() => {
        // Add your logic here:
        // - Check user subscription status
        // - Check time since last ad
        // - Check number of API calls made
        // - Random chance, etc.

        // For now, always show ad (you can customize this)
        return true;
    }, []);

    // Show real rewarded ad
    const showRewardedAd = useCallback(async (apiCallFunction) => {
        setIsLoadingAd(true);

        try {
            await googleAdService.showRewardedAd(
                // On reward earned
                (rewardData) => {
                    console.log('User earned reward:', rewardData);
                    // Execute the pending API call
                    apiCallFunction();
                    setIsLoadingAd(false);
                },
                // On error
                (error) => {
                    console.error('Ad error:', error);
                    setIsLoadingAd(false);
                    // You can decide whether to still execute API call on ad error
                    // For now, let's still execute it
                    apiCallFunction();
                }
            );
        } catch (error) {
            console.error('Failed to show ad:', error);
            setIsLoadingAd(false);
            // Fallback: execute API call anyway
            apiCallFunction();
        }
    }, []);

    // Trigger ad before API call
    const triggerAdBeforeApiCall = useCallback((apiCallFunction) => {
        if (shouldShowAd()) {
            setPendingApiCall(() => apiCallFunction);

            // Use real ads instead of modal
            showRewardedAd(apiCallFunction);
            return true; // Ad will be shown
        } else {
            // No ad needed, execute API call immediately
            apiCallFunction();
            return false; // No ad shown
        }
    }, [shouldShowAd, showRewardedAd]);

    // Handle fallback modal ad completion (keep for backup)
    const handleAdComplete = useCallback(() => {
        setShowAd(false);
        if (pendingApiCall) {
            pendingApiCall();
            setPendingApiCall(null);
        }
    }, [pendingApiCall]);

    // Handle ad skip
    const handleAdSkip = useCallback(() => {
        handleAdComplete();
    }, [handleAdComplete]);

    // Close ad without executing API call
    const handleAdCancel = useCallback(() => {
        setShowAd(false);
        setPendingApiCall(null);
    }, []);

    return {
        showAd,
        isLoadingAd,
        triggerAdBeforeApiCall,
        handleAdComplete,
        handleAdSkip,
        handleAdCancel
    };
};