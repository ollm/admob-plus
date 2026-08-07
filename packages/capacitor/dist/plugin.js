var capacitorAdMobPlus = (function (exports, core) {
    'use strict';

    exports.MaxAdContentRating = void 0;
    (function (MaxAdContentRating) {
        MaxAdContentRating["G"] = "G";
        MaxAdContentRating["MA"] = "MA";
        MaxAdContentRating["PG"] = "PG";
        MaxAdContentRating["T"] = "T";
        MaxAdContentRating["UNSPECIFIED"] = "";
    })(exports.MaxAdContentRating || (exports.MaxAdContentRating = {}));
    exports.TrackingAuthorizationStatus = void 0;
    (function (TrackingAuthorizationStatus) {
        TrackingAuthorizationStatus[TrackingAuthorizationStatus["notDetermined"] = 0] = "notDetermined";
        TrackingAuthorizationStatus[TrackingAuthorizationStatus["restricted"] = 1] = "restricted";
        TrackingAuthorizationStatus[TrackingAuthorizationStatus["denied"] = 2] = "denied";
        TrackingAuthorizationStatus[TrackingAuthorizationStatus["authorized"] = 3] = "authorized";
    })(exports.TrackingAuthorizationStatus || (exports.TrackingAuthorizationStatus = {}));

    var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };
    var _MobileAd_created, _MobileAd_init, _BannerAd_loaded;
    const AdMobPlus = core.registerPlugin('AdMobPlus', {
        web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.AdMobPlusWeb()),
    });
    let started = false;
    let startPromise = null;
    const start = AdMobPlus.start;
    AdMobPlus.start = async () => {
        startPromise = start();
        const result = await startPromise;
        started = true;
        return result;
    };
    class MobileAd {
        constructor(opts) {
            _MobileAd_created.set(this, false);
            _MobileAd_init.set(this, null);
            this.opts = opts;
            this.id = MobileAd.nextId();
            MobileAd.allAds[this.id] = this;
        }
        static nextId() {
            MobileAd.idCounter += 1;
            return MobileAd.idCounter;
        }
        get adUnitId() {
            return this.opts.adUnitId;
        }
        async isLoaded() {
            await this.init();
            return AdMobPlus.adIsLoaded({ id: this.id });
        }
        async load() {
            await this.init();
            return AdMobPlus.adLoad(Object.assign(Object.assign({}, this.opts), { id: this.id }));
        }
        async show() {
            await this.init();
            return AdMobPlus.adShow({ id: this.id });
        }
        async hide() {
            await this.init();
            return AdMobPlus.adHide({ id: this.id });
        }
        async init() {
            var _a;
            if (__classPrivateFieldGet(this, _MobileAd_created, "f"))
                return;
            if (!started) {
                if (startPromise === null)
                    start();
                await startPromise;
            }
            if (__classPrivateFieldGet(this, _MobileAd_init, "f") === null) {
                const cls = (_a = this.constructor.cls) !== null && _a !== void 0 ? _a : this.constructor.name;
                __classPrivateFieldSet(this, _MobileAd_init, AdMobPlus.adCreate(Object.assign(Object.assign({}, this.opts), { id: this.id, cls })), "f");
            }
            await __classPrivateFieldGet(this, _MobileAd_init, "f");
            __classPrivateFieldSet(this, _MobileAd_created, true, "f");
        }
    }
    _MobileAd_created = new WeakMap(), _MobileAd_init = new WeakMap();
    MobileAd.allAds = {};
    MobileAd.idCounter = 0;
    class BannerAd extends MobileAd {
        constructor(opts) {
            super(Object.assign({ position: 'bottom' }, opts));
            _BannerAd_loaded.set(this, false);
        }
        isLoaded() {
            return super.isLoaded();
        }
        async load() {
            await super.load();
            __classPrivateFieldSet(this, _BannerAd_loaded, true, "f");
        }
        async show() {
            if (!__classPrivateFieldGet(this, _BannerAd_loaded, "f"))
                await this.load();
            await super.show();
        }
        hide() {
            return super.hide();
        }
    }
    _BannerAd_loaded = new WeakMap();
    BannerAd.cls = 'BannerAd';
    class InterstitialAd extends MobileAd {
        isLoaded() {
            return super.isLoaded();
        }
        async load() {
            return super.load();
        }
        async show() {
            return super.show();
        }
    }
    InterstitialAd.cls = 'InterstitialAd';
    class RewardedAd extends MobileAd {
        isLoaded() {
            return super.isLoaded();
        }
        async load() {
            return super.load();
        }
        async show() {
            return super.show();
        }
    }
    RewardedAd.cls = 'RewardedAd';
    class RewardedInterstitialAd extends MobileAd {
        isLoaded() {
            return super.isLoaded();
        }
        async load() {
            return super.load();
        }
        async show() {
            return super.show();
        }
    }
    RewardedInterstitialAd.cls = 'RewardedInterstitialAd';

    // THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
    class AdMobPlusWeb extends core.WebPlugin {
        async start(...opts) {
            console.log('start', opts);
        }
        async configure(...opts) {
            console.log('configure', opts);
        }
        async configRequest(...opts) {
            console.log('configRequest', opts);
        }
        async adCreate(...opts) {
            console.log('adCreate', opts);
        }
        async adIsLoaded(...opts) {
            console.log('adIsLoaded', opts);
            return false;
        }
        async adLoad(...opts) {
            console.log('adLoad', opts);
        }
        async adShow(...opts) {
            console.log('adShow', opts);
        }
        async adHide(...opts) {
            console.log('adHide', opts);
        }
        async trackingAuthorizationStatus(...opts) {
            console.log('trackingAuthorizationStatus', opts);
            return { status: false };
        }
        async requestTrackingAuthorization(...opts) {
            console.log('requestTrackingAuthorization', opts);
            return { status: false };
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AdMobPlusWeb: AdMobPlusWeb
    });

    exports.AdMobPlus = AdMobPlus;
    exports.BannerAd = BannerAd;
    exports.InterstitialAd = InterstitialAd;
    exports.RewardedAd = RewardedAd;
    exports.RewardedInterstitialAd = RewardedInterstitialAd;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
