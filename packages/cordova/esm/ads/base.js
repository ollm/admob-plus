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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { execAsync } from "../common";
/** @internal */
var MobileAd = /** @class */ (function () {
    function MobileAd(opts) {
        var _a;
        this.opts = opts;
        this.id = (_a = opts.id) !== null && _a !== void 0 ? _a : opts.adUnitId;
        MobileAd.allAds[this.id] = this;
    }
    Object.defineProperty(MobileAd, "allAds", {
        get: function () {
            var win = window;
            if (typeof win.admobAds === "undefined")
                win.admobAds = {};
            return win.admobAds;
        },
        enumerable: false,
        configurable: true
    });
    MobileAd.getAdById = function (id) {
        return MobileAd.allAds[id];
    };
    Object.defineProperty(MobileAd.prototype, "adUnitId", {
        get: function () {
            return this.opts.adUnitId;
        },
        enumerable: false,
        configurable: true
    });
    MobileAd.prototype.on = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var eventName = args[0], cb = args[1], rest = args.slice(2);
        var type = "admob.ad.".concat(eventName.toLowerCase());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        var listener = function (evt) {
            if (evt.adId === _this.id) {
                cb(evt);
            }
        };
        document.addEventListener.apply(document, __spreadArray([type, listener], rest, false));
        return function () {
            document.removeEventListener.apply(document, __spreadArray([type, listener], rest, false));
        };
    };
    MobileAd.prototype.isLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, execAsync("adIsLoaded", [{ id: this.id }])];
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
                        // TODO read `opts` in native code?
                        return [4 /*yield*/, execAsync("adLoad", [__assign(__assign({}, this.opts), { id: this.id })])];
                    case 2:
                        // TODO read `opts` in native code?
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MobileAd.prototype.show = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, execAsync("adShow", [__assign(__assign({}, opts), { id: this.id })])];
                }
            });
        });
    };
    MobileAd.prototype.hide = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, execAsync("adHide", [{ id: this.id }])];
                }
            });
        });
    };
    MobileAd.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                return [2 /*return*/, ((_a = this._initPromise) !== null && _a !== void 0 ? _a : (this._initPromise = this._init()))];
            });
        });
    };
    MobileAd.prototype._init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cls;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, admob.start()];
                    case 1:
                        _b.sent();
                        cls = (_a = this.constructor.cls) !== null && _a !== void 0 ? _a : this.constructor.name;
                        return [2 /*return*/, execAsync("adCreate", [__assign(__assign({}, this.opts), { id: this.id, cls: cls })])];
                }
            });
        });
    };
    return MobileAd;
}());
export { MobileAd };
//# sourceMappingURL=base.js.map