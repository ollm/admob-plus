import * as ads from "./ads";
import { type AdMobConfig, Events } from "./common";
export * from "./ads";
export * from "./common";
export declare class AdMob {
    readonly AppOpenAd: typeof ads.AppOpenAd;
    readonly BannerAd: typeof ads.BannerAd;
    readonly InterstitialAd: typeof ads.InterstitialAd;
    readonly NativeAd: typeof ads.NativeAd;
    readonly RewardedAd: typeof ads.RewardedAd;
    readonly RewardedInterstitialAd: typeof ads.RewardedInterstitialAd;
    readonly WebViewAd: typeof ads.WebViewAd;
    readonly Events: typeof Events;
    private _startPromise;
    configure(config: AdMobConfig): Promise<unknown>;
    start(): Promise<{
        version: string;
    }>;
    private _start;
}
declare global {
    const admob: AdMob;
}
export default AdMob;
