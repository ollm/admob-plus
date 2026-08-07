var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _MobileAd_created, _MobileAd_init, _BannerAd_loaded;
import { registerPlugin } from '@capacitor/core';
const AdMobPlus = registerPlugin('AdMobPlus', {
    web: () => import('./web').then((m) => new m.AdMobPlusWeb()),
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
export * from './definitions';
export { AdMobPlus, BannerAd, InterstitialAd, RewardedAd, RewardedInterstitialAd, };
//# sourceMappingURL=index.js.map