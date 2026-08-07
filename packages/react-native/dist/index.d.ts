import { NativeEventEmitter } from 'react-native';
import { AdMobPlusPlugin, MobileAdOptions } from './definitions';
export declare const eventEmitter: NativeEventEmitter;
export declare const AdMobPlus: AdMobPlusPlugin;
declare class MobileAd<T extends MobileAdOptions = MobileAdOptions> {
    private static allAds;
    private static idCounter;
    readonly id: number;
    protected readonly opts: T;
    private _init;
    constructor(opts: T);
    private static nextId;
    get adUnitId(): string;
    on(eventType: string, listener: (event: any) => void, context?: Record<string, unknown> | undefined): import("react-native").EmitterSubscription;
    protected isLoaded(): Promise<boolean>;
    protected load(): Promise<void>;
    protected show(): Promise<void>;
    protected init(): Promise<void>;
}
declare class InterstitialAd extends MobileAd {
    static cls: string;
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<void>;
}
declare class RewardedAd extends MobileAd {
    static cls: string;
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<void>;
}
declare class RewardedInterstitialAd extends MobileAd {
    static cls: string;
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<void>;
}
export * from './definitions';
export { InterstitialAd, RewardedAd, RewardedInterstitialAd };
export default AdMobPlus;
