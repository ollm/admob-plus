package admob.plus.cordova.ads

import admob.plus.cordova.Events
import admob.plus.cordova.ExecuteContext
import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAd
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAdEventCallback

class Interstitial(ctx: ExecuteContext) : AdBase(ctx) {
    private var mAd: InterstitialAd? = null

    override val isLoaded get() = mAd != null

    override fun onDestroy() {
        clear()
        super.onDestroy()
    }

    override fun load(ctx: ExecuteContext) {
        clear()
        InterstitialAd.load(adRequest, object : AdLoadCallback<InterstitialAd> {
            override fun onAdLoaded(ad: InterstitialAd) {
                mAd = ad
                mAd!!.adEventCallback = object : InterstitialAdEventCallback {
                    override fun onAdDismissedFullScreenContent() {
                        emit(Events.AD_DISMISS)
                    }

                    override fun onAdFailedToShowFullScreenContent(fullScreenContentError: FullScreenContentError) {
                        emit(Events.AD_SHOW_FAIL, fullScreenContentError)
                    }

                    override fun onAdShowedFullScreenContent() {
                        mAd = null
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
                mAd = null
                emit(Events.AD_LOAD_FAIL, adError)
                ctx.reject(adError.toString())
            }
        })
    }

    override fun show(ctx: ExecuteContext) {
        if (isLoaded) {
            mAd!!.show(ctx.activity)
            ctx.resolve()
        } else {
            ctx.reject("Ad is not loaded")
        }
    }

    private fun clear() {
        mAd?.let {
            it.adEventCallback = null
            mAd = null
        }
    }
}
