"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cordova = __importStar(require("cordova"));
var channel_1 = __importDefault(require("cordova/channel"));
var exec_1 = __importDefault(require("cordova/exec"));
var base_1 = require("./ads/base");
var common_1 = require("./common");
var index_1 = require("./index");
var admob = new index_1.AdMob();
// biome-ignore lint/suspicious/noExplicitAny: ignore
function onMessageFromNative(event) {
    var data = event.data;
    if (data === null || data === void 0 ? void 0 : data.adId) {
        data.ad = base_1.MobileAd.getAdById(data.adId);
    }
    cordova.fireDocumentEvent(event.type, data);
}
var feature = "onAdMobPlusReady";
channel_1.default.createSticky(feature);
channel_1.default.waitForInitialization(feature);
channel_1.default.onCordovaReady.subscribe(function () {
    var action = "ready";
    (0, exec_1.default)(onMessageFromNative, console.error, common_1.CordovaService, action, []);
    channel_1.default.initializationComplete(feature);
});
exports.default = admob;
//# sourceMappingURL=admob.js.map