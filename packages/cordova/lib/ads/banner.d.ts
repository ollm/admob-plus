import { MobileAd, type MobileAdOptions } from "./base";
type Position = "top" | "bottom";
export declare enum AdSizeType {
    BANNER = 0,
    LARGE_BANNER = 1,
    MEDIUM_RECTANGLE = 2,
    FULL_BANNER = 3,
    LEADERBOARD = 4,
    SMART_BANNER = 5
}
type BannerSize = AdSizeType | {
    width: number;
    height: number;
} | {
    adaptive: "anchored";
    orientation?: "portrait" | "landscape";
    width?: number;
} | {
    adaptive: "inline";
    maxHeight: number;
    width?: number;
};
export interface BannerAdOptions extends MobileAdOptions {
    position?: Position;
    size?: BannerSize;
    offset?: number;
}
export declare class BannerAd extends MobileAd<BannerAdOptions> {
    static readonly cls = "BannerAd";
    private _loaded;
    constructor(opts: BannerAdOptions);
    static config(opts: {
        backgroundColor?: string;
        marginTop?: number;
        marginBottom?: number;
    }): false | Promise<unknown>;
    load(): Promise<void>;
    show(): Promise<unknown>;
    hide(): Promise<unknown>;
}
export {};
