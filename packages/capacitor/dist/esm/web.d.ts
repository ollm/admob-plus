import { WebPlugin } from '@capacitor/core';
import type { AdMobPlusPlugin } from './definitions';
export declare class AdMobPlusWeb extends WebPlugin implements AdMobPlusPlugin {
    start(...opts: Parameters<AdMobPlusPlugin['start']>): ReturnType<AdMobPlusPlugin['start']>;
    configure(...opts: Parameters<AdMobPlusPlugin['configure']>): ReturnType<AdMobPlusPlugin['configure']>;
    configRequest(...opts: Parameters<AdMobPlusPlugin['configRequest']>): ReturnType<AdMobPlusPlugin['configRequest']>;
    adCreate(...opts: Parameters<AdMobPlusPlugin['adCreate']>): ReturnType<AdMobPlusPlugin['adCreate']>;
    adIsLoaded(...opts: Parameters<AdMobPlusPlugin['adIsLoaded']>): ReturnType<AdMobPlusPlugin['adIsLoaded']>;
    adLoad(...opts: Parameters<AdMobPlusPlugin['adLoad']>): ReturnType<AdMobPlusPlugin['adLoad']>;
    adShow(...opts: Parameters<AdMobPlusPlugin['adShow']>): ReturnType<AdMobPlusPlugin['adShow']>;
    adHide(...opts: Parameters<AdMobPlusPlugin['adHide']>): ReturnType<AdMobPlusPlugin['adHide']>;
    trackingAuthorizationStatus(...opts: Parameters<AdMobPlusPlugin['trackingAuthorizationStatus']>): ReturnType<AdMobPlusPlugin['trackingAuthorizationStatus']>;
    requestTrackingAuthorization(...opts: Parameters<AdMobPlusPlugin['requestTrackingAuthorization']>): ReturnType<AdMobPlusPlugin['requestTrackingAuthorization']>;
}
