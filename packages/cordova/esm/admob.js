import * as cordova from "cordova";
import channel from "cordova/channel";
import exec from "cordova/exec";
import { MobileAd } from "./ads/base";
import { CordovaService } from "./common";
import { AdMob } from "./index";
var admob = new AdMob();
// biome-ignore lint/suspicious/noExplicitAny: ignore
function onMessageFromNative(event) {
    var data = event.data;
    if (data === null || data === void 0 ? void 0 : data.adId) {
        data.ad = MobileAd.getAdById(data.adId);
    }
    cordova.fireDocumentEvent(event.type, data);
}
var feature = "onAdMobPlusReady";
channel.createSticky(feature);
channel.waitForInitialization(feature);
channel.onCordovaReady.subscribe(function () {
    var action = "ready";
    exec(onMessageFromNative, console.error, CordovaService, action, []);
    channel.initializationComplete(feature);
});
export default admob;
//# sourceMappingURL=admob.js.map