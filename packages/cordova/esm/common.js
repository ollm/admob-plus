export var CordovaService = "AdMob";
export var Events;
(function (Events) {
    Events["adClick"] = "admob.ad.click";
    Events["adDismiss"] = "admob.ad.dismiss";
    Events["adImpression"] = "admob.ad.impression";
    Events["adLoad"] = "admob.ad.load";
    Events["adLoadFail"] = "admob.ad.loadfail";
    Events["adReward"] = "admob.ad.reward";
    Events["adShow"] = "admob.ad.show";
    Events["adShowFail"] = "admob.ad.showfail";
    Events["bannerSize"] = "admob.banner.size";
    Events["ready"] = "admob.ready";
})(Events || (Events = {}));
/** @internal */
export function execAsync(action, args) {
    return new Promise(function (resolve, reject) {
        cordova.exec(resolve, reject, CordovaService, action, args);
    });
}
//# sourceMappingURL=common.js.map