import { MobileAd, type MobileAdOptions } from "./base";
export interface ServerSideVerificationOptions {
    customData?: string;
    userId?: string;
}
export interface RewardedAdOptions extends MobileAdOptions {
    serverSideVerification?: ServerSideVerificationOptions;
}
export declare class RewardedAd extends MobileAd<RewardedAdOptions> {
    static readonly cls = "RewardedAd";
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<unknown>;
}
