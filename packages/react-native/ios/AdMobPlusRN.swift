import GoogleMobileAds

@objc(AdMobPlusRN)
class AdMobPlusRN: RCTEventEmitter {
    var hasListeners = false

    override init() {
        super.init()

        AMBContext.plugin = self
    }

    override func supportedEvents() -> [String] {
        return AMBEvents.allCases.map { $0.rawValue }
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    @objc func start(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: RCTPromiseRejectBlock) {
        MobileAds.shared.start(completionHandler: { _ in
            resolve(["version": MobileAds.shared.versionNumber])
        })
    }

    @objc func configure(_ opts: NSDictionary,
                         resolver resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
        let ctx = AMBContext(opts, resolve, reject)

        if let muted = ctx.optAppMuted() {
            MobileAds.shared.isApplicationMuted = muted
        }

        if let volume = ctx.optAppVolume() {
            MobileAds.shared.applicationVolume = volume
        }

        let requestConfiguration = MobileAds.shared.requestConfiguration

        if let maxAdContentRating = ctx.optMaxAdContentRating() {
            requestConfiguration.maxAdContentRating = maxAdContentRating
        }

        if let tag = ctx.optChildDirectedTreatmentTag() {
            requestConfiguration.tagForChildDirectedTreatment = tag
        }

        if let tag = ctx.optUnderAgeOfConsentTag() {
            requestConfiguration.tagForUnderAgeOfConsent = tag
        }

        if let testDevices = ctx.optTestDeviceIds() {
            requestConfiguration.testDeviceIdentifiers = testDevices
        }

        resolve(nil)
    }

    @objc func adCreate(_ opts: NSDictionary,
                        resolver resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
        let ctx = AMBContext(opts, resolve, reject)

        if let adClass = ctx.optString("cls") {
            var ad: AMBCoreAd?
            switch adClass {
            case "InterstitialAd":
                ad = AMBInterstitial(ctx)
            case "RewardedAd":
                ad = AMBRewarded(ctx)
            case "RewardedInterstitialAd":
                ad = AMBRewardedInterstitial(ctx)
            default:
                break
            }
            if ad != nil {
                ctx.resolve()
            } else {
                ctx.reject("fail to create ad: \(ctx.optId() ?? -1)")
            }
        } else {
            ctx.reject()
        }
    }

    @objc func adIsLoaded(_ opts: NSDictionary,
                          resolver resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
        let ctx = AMBContext(opts, resolve, reject)

        DispatchQueue.main.async {
            if let ad = ctx.optAdOrError() as? AMBAdBase {
                ctx.resolve(ad.isLoaded())
            }
        }
    }

    @objc func adLoad(_ opts: NSDictionary,
                      resolver resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        let ctx = AMBContext(opts, resolve, reject)

        DispatchQueue.main.async {
            if let ad = ctx.optAdOrError() as? AMBAdBase {
                ad.load(ctx)
            }
        }
    }

    @objc func adShow(_ opts: NSDictionary,
                      resolver resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        let ctx = AMBContext(opts, resolve, reject)

        DispatchQueue.main.async {
            if let ad = ctx.optAdOrError() as? AMBAdBase {
                if ad.isLoaded() {
                    ad.show(ctx)
                } else {
                    ctx.reject("Ad is not loaded: \(ctx.optId() ?? -1)")
                }
            }
        }
    }

    func emit(_ name: String, _ data: [String: Any]) {
        if self.hasListeners {
            self.sendEvent(withName: name, body: data)
        }
    }
}
