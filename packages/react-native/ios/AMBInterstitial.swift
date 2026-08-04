import GoogleMobileAds

class AMBInterstitial: AMBAdBase, FullScreenContentDelegate {
    var ad: InterstitialAd?

    deinit {
        clear()
    }

    override func isLoaded() -> Bool {
        return self.ad != nil
    }

    override func load(_ ctx: AMBContext) {
        clear()

        InterstitialAd.load(
            withAdUnitID: adUnitId,
            request: adRequest,
            completionHandler: { ad, error in
                if error != nil {
                    self.emit(AMBEvents.adLoadFail, error!)
                    ctx.reject(error!)
                    return
                }

                self.ad = ad
                ad?.fullScreenContentDelegate = self

                self.emit(AMBEvents.adLoad)

                ctx.resolve()
            })
    }

    override func show(_ ctx: AMBContext) {
        ad?.present(fromRootViewController: self.rootViewController)
        ctx.resolve()
    }

    func adDidRecordImpression(_ ad: FullScreenPresentingAd) {
        self.emit(AMBEvents.adImpression)
    }

    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        clear()
        self.emit(AMBEvents.adShowFail, error)
    }

    func adDidPresentFullScreenContent(_ ad: FullScreenPresentingAd) {
        self.emit(AMBEvents.adShow)
    }

    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
        clear()
        self.emit(AMBEvents.adDismiss)
    }

    private func clear() {
        ad?.fullScreenContentDelegate = nil
        ad = nil
    }
}
