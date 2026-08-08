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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { IonicNativePlugin } from '@ionic-native/core';
import { fromEvent } from 'rxjs';
var plugin = 'admob-plus-cordova';
var pluginName = 'AdMob';
// helper
var h = {
    get admob() {
        return window.admob;
    },
};
var BannerAd = /** @class */ (function (_super) {
    __extends(BannerAd, _super);
    function BannerAd(opts) {
        var _this = _super.call(this) || this;
        _this.obj = new h.admob.BannerAd(opts);
        return _this;
    }
    Object.defineProperty(BannerAd.prototype, "adUnitId", {
        get: function () {
            return this.obj.adUnitId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BannerAd.prototype, "id", {
        get: function () {
            return this.obj.id;
        },
        enumerable: false,
        configurable: true
    });
    BannerAd.prototype.load = function () {
        return this.obj.load();
    };
    BannerAd.prototype.show = function () {
        return this.obj.show();
    };
    BannerAd.prototype.hide = function () {
        return this.obj.hide();
    };
    BannerAd.prototype.on = function () {
        var _a;
        var opts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            opts[_i] = arguments[_i];
        }
        return (_a = this.obj).on.apply(_a, opts);
    };
    BannerAd.plugin = plugin;
    BannerAd.pluginName = pluginName;
    BannerAd.pluginRef = 'admob.BannerAd';
    return BannerAd;
}(IonicNativePlugin));
export { BannerAd };
var InterstitialAd = /** @class */ (function (_super) {
    __extends(InterstitialAd, _super);
    function InterstitialAd(opts) {
        var _this = _super.call(this) || this;
        _this.obj = new h.admob.InterstitialAd(opts);
        return _this;
    }
    Object.defineProperty(InterstitialAd.prototype, "adUnitId", {
        get: function () {
            return this.obj.adUnitId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InterstitialAd.prototype, "id", {
        get: function () {
            return this.obj.id;
        },
        enumerable: false,
        configurable: true
    });
    InterstitialAd.prototype.isLoaded = function () {
        return this.obj.isLoaded();
    };
    InterstitialAd.prototype.load = function () {
        return this.obj.load();
    };
    InterstitialAd.prototype.show = function () {
        return this.obj.show();
    };
    InterstitialAd.prototype.on = function () {
        var _a;
        var opts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            opts[_i] = arguments[_i];
        }
        return (_a = this.obj).on.apply(_a, opts);
    };
    InterstitialAd.plugin = plugin;
    InterstitialAd.pluginName = pluginName;
    InterstitialAd.pluginRef = 'admob.InterstitialAd';
    return InterstitialAd;
}(IonicNativePlugin));
export { InterstitialAd };
var RewardedAd = /** @class */ (function (_super) {
    __extends(RewardedAd, _super);
    function RewardedAd(opts) {
        var _this = _super.call(this) || this;
        _this.obj = new h.admob.RewardedAd(opts);
        return _this;
    }
    Object.defineProperty(RewardedAd.prototype, "adUnitId", {
        get: function () {
            return this.obj.adUnitId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RewardedAd.prototype, "id", {
        get: function () {
            return this.obj.id;
        },
        enumerable: false,
        configurable: true
    });
    RewardedAd.prototype.isLoaded = function () {
        return this.obj.isLoaded();
    };
    RewardedAd.prototype.load = function () {
        return this.obj.load();
    };
    RewardedAd.prototype.show = function () {
        return this.obj.show();
    };
    RewardedAd.prototype.on = function () {
        var _a;
        var opts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            opts[_i] = arguments[_i];
        }
        return (_a = this.obj).on.apply(_a, opts);
    };
    RewardedAd.plugin = plugin;
    RewardedAd.pluginName = pluginName;
    RewardedAd.pluginRef = 'admob.RewardedAd';
    return RewardedAd;
}(IonicNativePlugin));
export { RewardedAd };
var RewardedInterstitialAd = /** @class */ (function (_super) {
    __extends(RewardedInterstitialAd, _super);
    function RewardedInterstitialAd(opts) {
        var _this = _super.call(this) || this;
        _this.obj = new h.admob.RewardedInterstitialAd(opts);
        return _this;
    }
    Object.defineProperty(RewardedInterstitialAd.prototype, "adUnitId", {
        get: function () {
            return this.obj.adUnitId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RewardedInterstitialAd.prototype, "id", {
        get: function () {
            return this.obj.id;
        },
        enumerable: false,
        configurable: true
    });
    RewardedInterstitialAd.prototype.isLoaded = function () {
        return this.obj.isLoaded();
    };
    RewardedInterstitialAd.prototype.load = function () {
        return this.obj.load();
    };
    RewardedInterstitialAd.prototype.show = function () {
        return this.obj.show();
    };
    RewardedInterstitialAd.prototype.on = function () {
        var _a;
        var opts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            opts[_i] = arguments[_i];
        }
        return (_a = this.obj).on.apply(_a, opts);
    };
    RewardedInterstitialAd.plugin = plugin;
    RewardedInterstitialAd.pluginName = pluginName;
    RewardedInterstitialAd.pluginRef = 'admob.RewardedInterstitialAd';
    return RewardedInterstitialAd;
}(IonicNativePlugin));
export { RewardedInterstitialAd };
var NativeAd = /** @class */ (function (_super) {
    __extends(NativeAd, _super);
    function NativeAd(opts) {
        var _this = _super.call(this) || this;
        _this.obj = new h.admob.NativeAd(opts);
        return _this;
    }
    Object.defineProperty(NativeAd.prototype, "adUnitId", {
        get: function () {
            return this.obj.adUnitId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NativeAd.prototype, "id", {
        get: function () {
            return this.obj.id;
        },
        enumerable: false,
        configurable: true
    });
    NativeAd.prototype.isLoaded = function () {
        return this.obj.isLoaded();
    };
    NativeAd.prototype.load = function () {
        return this.obj.load();
    };
    NativeAd.prototype.show = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this.obj).show.apply(_a, args);
    };
    NativeAd.prototype.update = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this.obj).update.apply(_a, args);
    };
    NativeAd.prototype.hide = function () {
        return this.obj.hide();
    };
    NativeAd.prototype.showWith = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this.obj).showWith.apply(_a, args);
    };
    NativeAd.prototype.on = function () {
        var _a;
        var opts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            opts[_i] = arguments[_i];
        }
        return (_a = this.obj).on.apply(_a, opts);
    };
    NativeAd.plugin = plugin;
    NativeAd.pluginName = pluginName;
    NativeAd.pluginRef = 'admob.NativeAd';
    return NativeAd;
}(IonicNativePlugin));
export { NativeAd };
var AdMob = /** @class */ (function (_super) {
    __extends(AdMob, _super);
    function AdMob() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdMob.prototype.start = function () {
        return h.admob.start();
    };
    AdMob.prototype.configure = function () {
        var _a;
        var opts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            opts[_i] = arguments[_i];
        }
        return (_a = h.admob).configure.apply(_a, opts);
    };
    AdMob.prototype.on = function (event) {
        return fromEvent(document, event);
    };
    AdMob.platforms = ['Android', 'iOS'];
    AdMob.plugin = plugin;
    AdMob.pluginName = pluginName;
    AdMob.pluginRef = 'admob';
    AdMob.repo = 'https://github.com/admob-plus/admob-plus';
    AdMob = __decorate([
        Injectable()
    ], AdMob);
    return AdMob;
}(IonicNativePlugin));
export { AdMob };
//# sourceMappingURL=index.js.map