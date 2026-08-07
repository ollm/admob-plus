/** @internal */
export type MobileAdOptions = {
    id?: string;
    adUnitId: string;
    contentUrl?: string;
    keywords?: string[];
    npa?: "1";
};
/** @internal */
export declare class MobileAd<T extends MobileAdOptions = MobileAdOptions> {
    readonly id: string;
    protected readonly opts: T;
    private _initPromise;
    constructor(opts: T);
    private static get allAds();
    static getAdById(id: string): MobileAd<MobileAdOptions>;
    get adUnitId(): string;
    on(...args: Parameters<typeof document.addEventListener>): () => void;
    protected isLoaded(): Promise<boolean>;
    protected load(): Promise<void>;
    protected show(opts?: Record<string, unknown>): Promise<unknown>;
    protected hide(): Promise<unknown>;
    protected init(): Promise<unknown>;
    private _init;
}
