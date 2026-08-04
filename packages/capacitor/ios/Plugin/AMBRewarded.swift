import Capacitor
import GoogleMobileAds

class AMBRewarded: AMBAdBase, FullScreenContentDelegate {
    var rewardedAd: RewardedAd?

    deinit {
        rewardedAd?.fullScreenContentDelegate = nil
        rewardedAd = nil
    }

    override func isLoaded() -> Bool {
        return self.rewardedAd != nil
    }

    override func load(_ ctx: AMBContext) {
        RewardedAd.load(withAdUnitID: adUnitId, request: adRequest, completionHandler: { ad, error in
            if error != nil {
                self.emit(AMBEvents.rewardedLoadFail, error!)
                ctx.reject(error!)
                return
            }

            self.rewardedAd = ad
            ad?.fullScreenContentDelegate = self

            self.emit(AMBEvents.rewardedLoad)
            ctx.resolve()
        })
    }

    override func show(_ ctx: AMBContext) {
        if self.isLoaded() {
            self.rewardedAd?.present(fromRootViewController: AMBContext.rootViewController, userDidEarnRewardHandler: {
                self.emit(AMBEvents.rewardedReward, self.rewardedAd!.adReward)
            })
            ctx.resolve()
        } else {
            ctx.reject("Ad is not loaded")
        }
    }

    func adDidRecordImpression(_ ad: FullScreenPresentingAd) {
        self.emit(AMBEvents.rewardedImpression)
    }

    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        self.emit(AMBEvents.rewardedShowFail, error)
    }

    func adDidPresentFullScreenContent(_ ad: FullScreenPresentingAd) {
        self.emit(AMBEvents.rewardedShow)
    }

    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
        self.emit(AMBEvents.rewardedDismiss)
    }
}
