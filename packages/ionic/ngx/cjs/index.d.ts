import { IonicNativePlugin } from '@ionic-native/core';
import type { AdMob as IAdMob, BannerAd as IBannerAd, BannerAdOptions, InterstitialAd as IInterstitialAd, NativeAdOptions, RewardedAd as IRewardedAd, RewardedAdOptions, RewardedInterstitialAd as IRewardedInterstitialAd, NativeAd as INativeAd, RewardedInterstitialAdOptions } from 'admob-plus-cordova';
import { Observable } from 'rxjs';
export declare class BannerAd extends IonicNativePlugin implements Omit<IBannerAd, 'opts'> {
    static plugin: string;
    static pluginName: string;
    static pluginRef: string;
    private obj;
    constructor(opts: BannerAdOptions);
    get adUnitId(): string;
    get id(): string;
    load(): Promise<void>;
    show(): Promise<unknown>;
    hide(): Promise<unknown>;
    on(...opts: Parameters<IBannerAd['on']>): () => void;
}
export declare class InterstitialAd extends IonicNativePlugin implements Omit<IInterstitialAd, 'opts'> {
    static plugin: string;
    static pluginName: string;
    static pluginRef: string;
    private obj;
    constructor(opts: {
        adUnitId: string;
    });
    get adUnitId(): string;
    get id(): string;
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<unknown>;
    on(...opts: Parameters<IInterstitialAd['on']>): () => void;
}
export declare class RewardedAd extends IonicNativePlugin implements Omit<IRewardedAd, 'opts'> {
    static plugin: string;
    static pluginName: string;
    static pluginRef: string;
    private obj;
    constructor(opts: RewardedAdOptions);
    get adUnitId(): string;
    get id(): string;
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<unknown>;
    on(...opts: Parameters<IRewardedAd['on']>): () => void;
}
export declare class RewardedInterstitialAd extends IonicNativePlugin implements Omit<IRewardedInterstitialAd, 'opts'> {
    static plugin: string;
    static pluginName: string;
    static pluginRef: string;
    private obj;
    constructor(opts: RewardedInterstitialAdOptions);
    get adUnitId(): string;
    get id(): string;
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<unknown>;
    on(...opts: Parameters<IRewardedInterstitialAd['on']>): () => void;
}
export declare class NativeAd extends IonicNativePlugin implements Omit<INativeAd, 'opts'> {
    static plugin: string;
    static pluginName: string;
    static pluginRef: string;
    private obj;
    constructor(opts: NativeAdOptions);
    get adUnitId(): string;
    get id(): string;
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(...args: Parameters<INativeAd['show']>): Promise<unknown>;
    hide(): Promise<unknown>;
    showWith(...args: Parameters<INativeAd['showWith']>): Promise<void>;
    on(...opts: Parameters<INativeAd['on']>): () => void;
}
export declare class AdMob extends IonicNativePlugin implements Omit<IAdMob, 'AppOpenAd' | 'BannerAd' | 'BannerAd' | 'configRequest' | 'Events' | 'InterstitialAd' | 'InterstitialAd' | 'NativeAd' | 'NativeAd' | 'requestTrackingAuthorization' | 'RewardedAd' | 'RewardedAd' | 'RewardedInterstitialAd' | 'RewardedInterstitialAd' | 'setAppMuted' | 'setAppVolume' | 'TrackingAuthorizationStatus' | 'WebViewAd'> {
    static platforms: string[];
    static plugin: string;
    static pluginName: string;
    static pluginRef: string;
    static repo: string;
    start(): Promise<{
        version: string;
    }>;
    configure(...opts: Parameters<IAdMob['configure']>): Promise<unknown>;
    on(event: string): Observable<unknown>;
}
