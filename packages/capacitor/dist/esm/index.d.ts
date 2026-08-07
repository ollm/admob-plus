import type { AdMobPlusPlugin, MobileAdOptions } from './definitions';
declare const AdMobPlus: AdMobPlusPlugin;
declare class MobileAd<T extends MobileAdOptions = MobileAdOptions> {
    #private;
    private static allAds;
    private static idCounter;
    readonly id: number;
    protected readonly opts: T;
    constructor(opts: T);
    private static nextId;
    get adUnitId(): string;
    protected isLoaded(): Promise<boolean>;
    protected load(): Promise<void>;
    protected show(): Promise<void>;
    protected hide(): Promise<void>;
    protected init(): Promise<void>;
}
type Position = 'top' | 'bottom';
export interface BannerAdOptions extends MobileAdOptions {
    position?: Position;
}
declare class BannerAd extends MobileAd {
    #private;
    static cls: string;
    constructor(opts: BannerAdOptions);
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
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
export { AdMobPlus, BannerAd, InterstitialAd, RewardedAd, RewardedInterstitialAd, };
