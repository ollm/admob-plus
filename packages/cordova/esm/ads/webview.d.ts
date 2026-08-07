import { MobileAd, type MobileAdOptions } from "./base";
export interface WebViewAdOptions extends MobileAdOptions {
    src?: string;
    adsense: string;
    npa?: "1";
}
export declare class WebViewAd extends MobileAd<WebViewAdOptions> {
    static readonly cls = "WebViewAd";
    static checkIntegration(): Promise<void>;
    private _loaded;
    private _src;
    private _adsense;
    private _originalHref;
    private _historyCurrentHref;
    constructor(opts: WebViewAdOptions);
    addAd(options: {
        element: HTMLElement;
        slot: string;
        format?: string;
        fullWidth?: boolean;
        html?: string;
    }): boolean;
    private nodeScriptReplace;
    private nodeScriptClone;
    private isNodeScript;
    private historyReplaceState;
    private historySetPage;
    private historyOriginalHref;
    private historyCurrentHref;
    private historyRestoreOriginalHref;
    show(): Promise<unknown>;
}
