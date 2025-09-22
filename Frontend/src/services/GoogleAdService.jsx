// Google Ad Manager Integration Service
class GoogleAdService {
    constructor() {
        this.isInitialized = false;
        this.adSlot = null;
        this.rewardCallback = null;
    }

    // Initialize Google Publisher Tag
    async initialize() {
        if (this.isInitialized) return;

        return new Promise((resolve, reject) => {
            // Load GPT script
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';

            script.onload = () => {
                window.googletag = window.googletag || { cmd: [] };

                window.googletag.cmd.push(() => {
                    // Replace with your actual Ad Unit ID
                    this.adSlot = window.googletag.defineSlot(
                        '/YOUR_NETWORK_CODE/YOUR_AD_UNIT_ID',
                        [640, 480],
                        'rewarded-ad-container'
                    ).addService(window.googletag.pubads());

                    window.googletag.pubads().enableSingleRequest();
                    window.googletag.enableServices();

                    this.isInitialized = true;
                    resolve();
                });
            };

            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Show rewarded ad
    async showRewardedAd(onReward, onError) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        this.rewardCallback = onReward;

        return new Promise((resolve, reject) => {
            window.googletag.cmd.push(() => {
                // Create ad container if it doesn't exist
                let container = document.getElementById('rewarded-ad-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'rewarded-ad-container';
                    container.style.position = 'fixed';
                    container.style.top = '50%';
                    container.style.left = '50%';
                    container.style.transform = 'translate(-50%, -50%)';
                    container.style.zIndex = '9999';
                    container.style.backgroundColor = 'rgba(0,0,0,0.8)';
                    container.style.padding = '20px';
                    container.style.borderRadius = '10px';
                    document.body.appendChild(container);
                }

                // Set up event listeners
                window.googletag.pubads().addEventListener('slotRenderEnded', (event) => {
                    if (event.slot === this.adSlot) {
                        if (event.isEmpty) {
                            onError('No ad available');
                            reject('No ad available');
                        } else {
                            console.log('Ad loaded successfully');
                        }
                    }
                });

                // Listen for rewarded ad events
                window.googletag.pubads().addEventListener('rewardedSlotReady', (event) => {
                    console.log('Rewarded ad ready');
                    // Show the ad
                    event.makeRewardedVisible();
                });

                window.googletag.pubads().addEventListener('rewardedSlotClosed', (event) => {
                    // Clean up
                    const container = document.getElementById('rewarded-ad-container');
                    if (container) {
                        container.remove();
                    }

                    // Check if user earned reward
                    if (event.payload && event.payload.reward) {
                        this.rewardCallback(event.payload);
                        resolve(event.payload);
                    } else {
                        reject('Ad closed without reward');
                    }
                });

                // Display the ad
                window.googletag.display(this.adSlot);
                window.googletag.pubads().refresh([this.adSlot]);
            });
        });
    }
}

export const googleAdService = new GoogleAdService();