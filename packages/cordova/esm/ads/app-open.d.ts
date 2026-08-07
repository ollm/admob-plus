import { MobileAd, type MobileAdOptions } from "./base";
export declare class AppOpenAd extends MobileAd<MobileAdOptions> {
    static readonly cls = "AppOpenAd";
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<boolean>;
}
