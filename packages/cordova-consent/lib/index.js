"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consent = exports.Events = exports.PrivacyOptionsRequirementStatus = exports.ConsentStatus = exports.ConsentForm = exports.TrackingAuthorizationStatus = exports.FormStatus = exports.DebugGeography = void 0;
var CordovaService = "Consent";
function execAsync(action, args) {
    return new Promise(function (resolve, reject) {
        cordova.exec(resolve, reject, CordovaService, action, args);
    });
}
var DebugGeography;
(function (DebugGeography) {
    DebugGeography[DebugGeography["Disabled"] = 0] = "Disabled";
    DebugGeography[DebugGeography["EEA"] = 1] = "EEA";
    DebugGeography[DebugGeography["NotEEA"] = 2] = "NotEEA";
    DebugGeography[DebugGeography["RegulatedUsState"] = 3] = "RegulatedUsState";
    DebugGeography[DebugGeography["Other"] = 4] = "Other";
})(DebugGeography || (exports.DebugGeography = DebugGeography = {}));
var FormStatus;
(function (FormStatus) {
    FormStatus[FormStatus["Unknown"] = 0] = "Unknown";
    FormStatus[FormStatus["Available"] = 1] = "Available";
    FormStatus[FormStatus["Unavailable"] = 2] = "Unavailable";
})(FormStatus || (exports.FormStatus = FormStatus = {}));
var TrackingAuthorizationStatus;
(function (TrackingAuthorizationStatus) {
    TrackingAuthorizationStatus[TrackingAuthorizationStatus["notDetermined"] = 0] = "notDetermined";
    TrackingAuthorizationStatus[TrackingAuthorizationStatus["restricted"] = 1] = "restricted";
    TrackingAuthorizationStatus[TrackingAuthorizationStatus["denied"] = 2] = "denied";
    TrackingAuthorizationStatus[TrackingAuthorizationStatus["authorized"] = 3] = "authorized";
})(TrackingAuthorizationStatus || (exports.TrackingAuthorizationStatus = TrackingAuthorizationStatus = {}));
var ConsentForm = /** @class */ (function () {
    function ConsentForm(id) {
        this.id = id;
    }
    ConsentForm.prototype.show = function () {
        return execAsync("showForm", [{ id: this.id }]);
    };
    return ConsentForm;
}());
exports.ConsentForm = ConsentForm;
var ConsentStatus;
(function (ConsentStatus) {
    ConsentStatus[ConsentStatus["Unknown"] = 0] = "Unknown";
    ConsentStatus[ConsentStatus["Required"] = 1] = "Required";
    ConsentStatus[ConsentStatus["NotRequired"] = 2] = "NotRequired";
    ConsentStatus[ConsentStatus["Obtained"] = 3] = "Obtained";
})(ConsentStatus || (exports.ConsentStatus = ConsentStatus = {}));
var PrivacyOptionsRequirementStatus;
(function (PrivacyOptionsRequirementStatus) {
    PrivacyOptionsRequirementStatus[PrivacyOptionsRequirementStatus["Unknown"] = 0] = "Unknown";
    PrivacyOptionsRequirementStatus[PrivacyOptionsRequirementStatus["Required"] = 1] = "Required";
    PrivacyOptionsRequirementStatus[PrivacyOptionsRequirementStatus["NotRequired"] = 2] = "NotRequired";
})(PrivacyOptionsRequirementStatus || (exports.PrivacyOptionsRequirementStatus = PrivacyOptionsRequirementStatus = {}));
var Events;
(function (Events) {
    Events["ready"] = "consent.ready";
})(Events || (exports.Events = Events = {}));
var Consent = /** @class */ (function () {
    function Consent() {
        this.ConsentStatus = ConsentStatus;
        this.DebugGeography = DebugGeography;
        this.FormStatus = FormStatus;
        this.PrivacyOptionsRequirementStatus = PrivacyOptionsRequirementStatus;
        document.addEventListener("deviceready", function () {
            var action = "ready";
            cordova.exec(function (event) {
                cordova.fireDocumentEvent(event.type, event.data);
            }, console.error, CordovaService, action);
        }, false);
    }
    Consent.prototype.canRequestAds = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execAsync("canRequestAds")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Consent.prototype.privacyOptionsRequirementStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execAsync("privacyOptionsRequirementStatus")];
                    case 1:
                        n = _a.sent();
                        return [2 /*return*/, PrivacyOptionsRequirementStatus[PrivacyOptionsRequirementStatus[n]]];
                }
            });
        });
    };
    Consent.prototype.loadAndShowIfRequired = function () {
        return execAsync("loadAndShowIfRequired");
    };
    Consent.prototype.showPrivacyOptionsForm = function () {
        return execAsync("showPrivacyOptionsForm");
    };
    Consent.prototype.trackingAuthorizationStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cordova.platformId === "ios")) return [3 /*break*/, 2];
                        return [4 /*yield*/, execAsync("trackingAuthorizationStatus")];
                    case 1:
                        n = _a.sent();
                        if (n !== false) {
                            return [2 /*return*/, TrackingAuthorizationStatus[TrackingAuthorizationStatus[n]]];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    Consent.prototype.requestTrackingAuthorization = function () {
        return __awaiter(this, void 0, void 0, function () {
            var n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cordova.platformId === "ios")) return [3 /*break*/, 2];
                        return [4 /*yield*/, execAsync("requestTrackingAuthorization")];
                    case 1:
                        n = _a.sent();
                        if (n !== false) {
                            return [2 /*return*/, TrackingAuthorizationStatus[TrackingAuthorizationStatus[n]]];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    Consent.prototype.getConsentStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execAsync("getConsentStatus")];
                    case 1:
                        n = _a.sent();
                        return [2 /*return*/, ConsentStatus[ConsentStatus[n]]];
                }
            });
        });
    };
    Consent.prototype.getFormStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execAsync("getFormStatus")];
                    case 1:
                        n = _a.sent();
                        return [2 /*return*/, FormStatus[FormStatus[n]]];
                }
            });
        });
    };
    Consent.prototype.requestInfoUpdate = function (opts) {
        if (opts === void 0) { opts = {}; }
        return execAsync("requestInfoUpdate", [opts]);
    };
    Consent.prototype.loadForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execAsync("loadForm")];
                    case 1:
                        id = _a.sent();
                        return [2 /*return*/, new ConsentForm(id)];
                }
            });
        });
    };
    Consent.prototype.reset = function () {
        return execAsync("reset");
    };
    return Consent;
}());
exports.Consent = Consent;
//# sourceMappingURL=index.js.map