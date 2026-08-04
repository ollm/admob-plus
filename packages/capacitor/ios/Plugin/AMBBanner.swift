import Capacitor
import GoogleMobileAds

extension CAPBridgeViewController {
    @objc dynamic func _admobSwizzled_viewWillLayoutSubviews() {
        if self.responds(to: #selector(_admobSwizzled_viewWillLayoutSubviews)) {
            _admobSwizzled_viewWillLayoutSubviews()
        }
        if AMBBanner.mainView.superview != nil {
            NSLayoutConstraint.activate(AMBBanner.mainViewConstraints)
        }
    }

    static func admobSwizzle() {
        let selector1 = #selector(Self.viewWillLayoutSubviews)
        let selector2 = #selector(Self._admobSwizzled_viewWillLayoutSubviews)
        if let originalMethod = class_getInstanceMethod(Self.self, selector1),
           let swizzleMethod = class_getInstanceMethod(Self.self, selector2) {
            method_exchangeImplementations(originalMethod, swizzleMethod)
        }
    }
}

class AMBBanner: AMBAdBase, AdSizeDelegate, BannerViewDelegate {
    static let stackView = UIStackView(frame: rootView.frame)
    static let placeholderView = UIView(frame: stackView.frame)

    static let priortyLeast = UILayoutPriority(10)

    static let rootView = AMBHelper.window
    static let mainView = AMBContext.plugin.webView!
    static var mainViewConstraints: [NSLayoutConstraint] = []

    static let topConstraint = stackView.topAnchor.constraint(
        equalTo: AMBHelper.topAnchor)

    static let bottomConstraint = stackView.bottomAnchor.constraint(
            equalTo: AMBHelper.bottomAnchor)

    let adSize: AdSize!
    let position: String!
    var bannerView: BannerView!

    init(id: Int, adUnitId: String, adRequest: Request, adSize: AdSize, position: String) {
        self.adSize = adSize
        self.position = position

        super.init(id: id, adUnitId: adUnitId, adRequest: adRequest)
    }

    convenience init?(_ ctx: AMBContext) {
        guard let id = ctx.optId(),
              let adUnitId = ctx.optAdUnitID()
        else {
            return nil
        }

        let adSize = AdSizeBanner
        self.init(id: id,
                  adUnitId: adUnitId,
                  adRequest: ctx.optGADRequest(),
                  adSize: adSize,
                  position: ctx.optPosition())
    }

    override func isLoaded() -> Bool {
        return bannerView != nil
    }

    override func load(_ ctx: AMBContext) {
        if bannerView == nil {
            bannerView = BannerView(adSize: self.adSize)
            bannerView.adSizeDelegate = self
            bannerView.delegate = self
            bannerView.rootViewController = AMBContext.rootViewController
        }

        bannerView.adUnitID = adUnitId
        bannerView.load(adRequest)
        ctx.resolve()
    }

    override func show(_ ctx: AMBContext) {
        Self.prepareStackView()

        switch position {
        case "top":
            Self.stackView.insertArrangedSubview(bannerView, at: 0)
        default:
            Self.stackView.addArrangedSubview(bannerView)
        }

        bannerView.isHidden = false
        Self.updateLayout()
        ctx.resolve()
    }

    override func hide(_ ctx: AMBContext) {
        if bannerView != nil {
            bannerView.isHidden = true
            Self.stackView.removeArrangedSubview(bannerView)
            Self.updateLayout()
        }
        ctx.resolve()
    }

    func adView(_ bannerView: BannerView, willChangeAdSizeTo adSize: AdSize) {
        self.emit(AMBEvents.bannerSizeChange, adSize)
    }

    func bannerViewDidReceiveAd(_ bannerView: BannerView) {
        self.emit(AMBEvents.bannerLoad)
    }

    func bannerView(_ bannerView: BannerView,
                    didFailToReceiveAdWithError error: Error) {
        self.emit(AMBEvents.bannerLoadFail, error)
    }

    func bannerViewDidRecordImpression(_ bannerView: BannerView) {
        self.emit(AMBEvents.bannerImpression)
    }

    func bannerViewWillPresentScreen(_ bannerView: BannerView) {
        self.emit(AMBEvents.bannerOpen)
    }

    func bannerViewWillDismissScreen(_ bannerView: BannerView) {
    }

    func bannerViewDidDismissScreen(_ bannerView: BannerView) {
        self.emit(AMBEvents.bannerClose)
    }

    private static func prepareStackView() {
        if stackView.arrangedSubviews.isEmpty {
            CAPBridgeViewController.admobSwizzle()

            var constraints: [NSLayoutConstraint] = []

            stackView.axis = .vertical
            stackView.distribution = .fill
            stackView.alignment = .fill
            rootView.addSubview(stackView)
            stackView.translatesAutoresizingMaskIntoConstraints = false
            constraints += [
                stackView.leadingAnchor.constraint(equalTo: rootView.leadingAnchor),
                stackView.trailingAnchor.constraint(equalTo: rootView.trailingAnchor)
            ]

            placeholderView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            stackView.addArrangedSubview(placeholderView)
            var v: UIView = mainView
            while v != rootView {
                v.translatesAutoresizingMaskIntoConstraints = false
                mainViewConstraints += [
                    v.leadingAnchor.constraint(equalTo: placeholderView.leadingAnchor),
                    v.trailingAnchor.constraint(equalTo: placeholderView.trailingAnchor),
                    v.topAnchor.constraint(equalTo: placeholderView.topAnchor),
                    v.bottomAnchor.constraint(equalTo: placeholderView.bottomAnchor)
                ]
                v = v.superview!
            }
            constraints += mainViewConstraints

            let constraintTop = stackView.topAnchor.constraint(equalTo: rootView.topAnchor)
            let constraintBottom = stackView.bottomAnchor.constraint(equalTo: rootView.bottomAnchor)
            constraintTop.priority = priortyLeast
            constraintBottom.priority = priortyLeast
            constraints += [
                constraintBottom,
                constraintTop
            ]
            NSLayoutConstraint.activate(constraints)

            rootView.sendSubviewToBack(stackView)
        }
    }

    private static func updateLayout() {
        if stackView.arrangedSubviews.first is BannerView {
            AMBContext.plugin.bridge?.statusBarStyle = .lightContent
            topConstraint.isActive = true
        } else {
            topConstraint.isActive = false
        }

        if stackView.arrangedSubviews.last is BannerView {
            bottomConstraint.isActive = true
        } else {
            bottomConstraint.isActive = false
        }
    }
}
