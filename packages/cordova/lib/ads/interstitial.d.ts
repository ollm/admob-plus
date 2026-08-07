import { MobileAd, type MobileAdOptions } from "./base";
export declare class InterstitialAd extends MobileAd<MobileAdOptions> {
    static readonly cls = "InterstitialAd";
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<unknown>;
}
