import { MobileAd } from "./base";
import type { RewardedAdOptions } from "./rewarded";
export type RewardedInterstitialAdOptions = RewardedAdOptions;
export declare class RewardedInterstitialAd extends MobileAd<RewardedInterstitialAdOptions> {
    static readonly cls = "RewardedInterstitialAd";
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<unknown>;
}
