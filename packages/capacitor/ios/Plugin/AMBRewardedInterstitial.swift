import Capacitor
import GoogleMobileAds

class AMBRewardedInterstitial: AMBAdBase, FullScreenContentDelegate {
    var rewardedAd: RewardedInterstitialAd?

    deinit {
        rewardedAd?.fullScreenContentDelegate = nil
        rewardedAd = nil
    }

    override func isLoaded() -> Bool {
        return self.rewardedAd != nil
    }

    override func load(_ ctx: AMBContext) {
        RewardedInterstitialAd.load(withAdUnitID: adUnitId, request: adRequest, completionHandler: { ad, error in
            if error != nil {
                self.emit(AMBEvents.rewardedInterstitialLoadFail, error!)
                ctx.reject(error!)
                return
            }

            self.rewardedAd = ad
            ad?.fullScreenContentDelegate = self

            self.emit(AMBEvents.rewardedInterstitialLoad)
            ctx.resolve()
        })
    }

    override func show(_ ctx: AMBContext) {
        self.rewardedAd?.present(from: AMBContext.rootViewController, userDidEarnRewardHandler: {
            self.emit(AMBEvents.rewardedInterstitialReward, self.rewardedAd!.adReward)
        })
        ctx.resolve()
    }

    func adDidRecordImpression(_ ad: FullScreenPresentingAd) {
        self.emit(AMBEvents.rewardedInterstitialImpression)
    }

    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        self.emit(AMBEvents.rewardedInterstitialShowFail, error)
    }

    func adDidPresentFullScreenContent(_ ad: FullScreenPresentingAd) {
        self.emit(AMBEvents.rewardedInterstitialShow)
    }

    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
        self.emit(AMBEvents.rewardedInterstitialDismiss)
    }
}
