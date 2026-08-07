import { MobileAd, type MobileAdOptions } from "./base";
type ShowOptions = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export interface NativeAdOptions extends MobileAdOptions {
    view?: string;
}
export declare class NativeAd extends MobileAd<NativeAdOptions> {
    static readonly cls = "NativeAd";
    isLoaded(): Promise<boolean>;
    hide(): Promise<unknown>;
    load(): Promise<void>;
    show(opts?: ShowOptions): Promise<unknown>;
    showWith(elm: HTMLElement): Promise<void>;
}
export {};
