package admob.plus.cordova.ads

import admob.plus.cordova.Events
import admob.plus.cordova.ExecuteContext
import admob.plus.core.buildAdRequest
import com.google.android.libraries.ads.mobile.sdk.appopen.AppOpenAd
import com.google.android.libraries.ads.mobile.sdk.appopen.AppOpenAdEventCallback
import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback
import com.google.android.libraries.ads.mobile.sdk.common.AdRequest
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError

class AppOpen(ctx: ExecuteContext) : AdBase(ctx) {
    private var mAd: AppOpenAd? = null

    override fun onDestroy() {
        clear()
        super.onDestroy()
    }

    override fun load(ctx: ExecuteContext) {
        clear()
        AppOpenAd.load(
            adRequest,
            object : AdLoadCallback<AppOpenAd> {
                override fun onAdLoaded(ad: AppOpenAd) {
                    mAd = ad
                    ad.adEventCallback = object : AppOpenAdEventCallback {
                        override fun onAdDismissedFullScreenContent() {
                            clear()
                            emit(Events.AD_DISMISS)
                        }

                        override fun onAdFailedToShowFullScreenContent(fullScreenContentError: FullScreenContentError) {
                            clear()
                            emit(Events.AD_SHOW_FAIL, fullScreenContentError)
                        }

                        override fun onAdShowedFullScreenContent() {
                            emit(Events.AD_SHOW)
                        }

                        override fun onAdImpression() {
                            emit(Events.AD_IMPRESSION)
                        }
                    }
                    emit(Events.AD_LOAD)
                    ctx.resolve()
                }

                override fun onAdFailedToLoad(adError: LoadAdError) {
                    clear()
                    emit(Events.AD_LOAD_FAIL, adError)
                    ctx.reject(adError.toString())
                }
            })
    }

    override val isLoaded: Boolean get() = mAd != null

    override fun show(ctx: ExecuteContext) {
        mAd?.show(plugin.activity)
        ctx.resolve(true)
    }

    private fun clear() {
        if (mAd != null) {
            mAd = null
        }
    }
}
