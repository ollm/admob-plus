import * as ads from "./ads";
import { Events, execAsync } from "./common";
export * from "./ads";
export * from "./common";
var AdMob = /** @class */ (function () {
    function AdMob() {
        this.AppOpenAd = ads.AppOpenAd;
        this.BannerAd = ads.BannerAd;
        this.InterstitialAd = ads.InterstitialAd;
        this.NativeAd = ads.NativeAd;
        this.RewardedAd = ads.RewardedAd;
        this.RewardedInterstitialAd = ads.RewardedInterstitialAd;
        this.WebViewAd = ads.WebViewAd;
        this.Events = Events;
    }
    AdMob.prototype.configure = function (config) {
        return execAsync("configure", [config]);
    };
    AdMob.prototype.start = function () {
        var _a;
        // biome-ignore lint/suspicious/noAssignInExpressions: ignore
        return ((_a = this._startPromise) !== null && _a !== void 0 ? _a : (this._startPromise = this._start()));
    };
    AdMob.prototype._start = function () {
        return execAsync("start");
    };
    return AdMob;
}());
export { AdMob };
export default AdMob;
//# sourceMappingURL=index.js.map