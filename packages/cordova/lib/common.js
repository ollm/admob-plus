"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = exports.CordovaService = void 0;
exports.execAsync = execAsync;
exports.CordovaService = "AdMob";
var Events;
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
})(Events || (exports.Events = Events = {}));
/** @internal */
function execAsync(action, args) {
    return new Promise(function (resolve, reject) {
        cordova.exec(resolve, reject, exports.CordovaService, action, args);
    });
}
//# sourceMappingURL=common.js.map