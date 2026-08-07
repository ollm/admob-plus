"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardedInterstitialAd = exports.RewardedAd = exports.InterstitialAd = exports.AdMobPlus = exports.eventEmitter = void 0;
var react_native_1 = require("react-native");
var AdMobPlusRN = react_native_1.NativeModules.AdMobPlusRN;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
exports.eventEmitter = react_native_1.Platform.select({
    ios: new react_native_1.NativeEventEmitter(AdMobPlusRN),
    android: react_native_1.DeviceEventEmitter,
});
exports.AdMobPlus = AdMobPlusRN;
var MobileAd = /** @class */ (function () {
    function MobileAd(opts) {
        var _this = this;
        var _a;
        this.opts = opts;
        this.id = MobileAd.nextId();
        MobileAd.allAds[this.id] = this;
        var cls = (_a = this.constructor.cls) !== null && _a !== void 0 ? _a : this.constructor.name;
        this._init = exports.AdMobPlus.adCreate(__assign(__assign({}, this.opts), { id: this.id, cls: cls })).then(function () {
            _this._init = null;
        });
    }
    MobileAd.nextId = function () {
        MobileAd.idCounter += 1;
        return MobileAd.idCounter;
    };
    Object.defineProperty(MobileAd.prototype, "adUnitId", {
        get: function () {
            return this.opts.adUnitId;
        },
        enumerable: false,
        configurable: true
    });
    MobileAd.prototype.on = function (eventType, listener, context) {
        var _this = this;
        return exports.eventEmitter.addListener("ad.".concat(eventType), function (event) {
            if (event && event.adId === _this.id) {
                listener(event);
            }
        }, context);
    };
    MobileAd.prototype.isLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, exports.AdMobPlus.adIsLoaded({ id: this.id })];
                }
            });
        });
    };
    MobileAd.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, exports.AdMobPlus.adLoad({ id: this.id })];
                }
            });
        });
    };
    MobileAd.prototype.show = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, exports.AdMobPlus.adShow({ id: this.id })];
                }
            });
        });
    };
    MobileAd.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._init !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._init];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    MobileAd.allAds = {};
    MobileAd.idCounter = 0;
    return MobileAd;
}());
var InterstitialAd = /** @class */ (function (_super) {
    __extends(InterstitialAd, _super);
    function InterstitialAd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InterstitialAd.prototype.isLoaded = function () {
        return _super.prototype.isLoaded.call(this);
    };
    InterstitialAd.prototype.load = function () {
        return _super.prototype.load.call(this);
    };
    InterstitialAd.prototype.show = function () {
        return _super.prototype.show.call(this);
    };
    InterstitialAd.cls = 'InterstitialAd';
    return InterstitialAd;
}(MobileAd));
exports.InterstitialAd = InterstitialAd;
var RewardedAd = /** @class */ (function (_super) {
    __extends(RewardedAd, _super);
    function RewardedAd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RewardedAd.prototype.isLoaded = function () {
        return _super.prototype.isLoaded.call(this);
    };
    RewardedAd.prototype.load = function () {
        return _super.prototype.load.call(this);
    };
    RewardedAd.prototype.show = function () {
        return _super.prototype.show.call(this);
    };
    RewardedAd.cls = 'RewardedAd';
    return RewardedAd;
}(MobileAd));
exports.RewardedAd = RewardedAd;
var RewardedInterstitialAd = /** @class */ (function (_super) {
    __extends(RewardedInterstitialAd, _super);
    function RewardedInterstitialAd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RewardedInterstitialAd.prototype.isLoaded = function () {
        return _super.prototype.isLoaded.call(this);
    };
    RewardedInterstitialAd.prototype.load = function () {
        return _super.prototype.load.call(this);
    };
    RewardedInterstitialAd.prototype.show = function () {
        return _super.prototype.show.call(this);
    };
    RewardedInterstitialAd.cls = 'RewardedInterstitialAd';
    return RewardedInterstitialAd;
}(MobileAd));
exports.RewardedInterstitialAd = RewardedInterstitialAd;
__exportStar(require("./definitions"), exports);
exports.default = exports.AdMobPlus;
