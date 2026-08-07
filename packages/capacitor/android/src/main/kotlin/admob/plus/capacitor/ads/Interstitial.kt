package admob.plus.capacitor.ads

import admob.plus.capacitor.ExecuteContext
import admob.plus.capacitor.Generated
import admob.plus.core.Context
import admob.plus.core.GenericAd
import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAd
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAdEventCallback

class Interstitial(ctx: ExecuteContext?) : AdBase(ctx), GenericAd {
    private var mAd: InterstitialAd? = null
    override fun destroy() {
        clear()
        super.destroy()
    }

    override fun load(ctx: Context?) {
        clear()
        InterstitialAd.load(
            ctx!!.optAdRequest(),
            object : AdLoadCallback<InterstitialAd> {
                override fun onAdLoaded(interstitialAd: InterstitialAd) {
                    mAd = interstitialAd
                    mAd!!.adEventCallback = object : InterstitialAdEventCallback {
                        override fun onAdDismissedFullScreenContent() {
                            clear()
                            emit(Generated.Events.INTERSTITIAL_DISMISS)
                        }

                        override fun onAdFailedToShowFullScreenContent(adError: FullScreenContentError) {
                            emit(Generated.Events.INTERSTITIAL_SHOW_FAIL, adError)
                        }

                        override fun onAdShowedFullScreenContent() {
                            emit(Generated.Events.INTERSTITIAL_SHOW)
                        }

                        override fun onAdImpression() {
                            emit(Generated.Events.INTERSTITIAL_IMPRESSION)
                        }
                    }
                    emit(Generated.Events.INTERSTITIAL_LOAD)
                    ctx.resolve()
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    clear()
                    emit(Generated.Events.INTERSTITIAL_LOAD_FAIL, loadAdError)
                    ctx.reject(loadAdError.message)
                }
            })
    }

    override val isLoaded: Boolean
        get() = mAd != null

    override fun show(ctx: Context?) {
        mAd!!.show(activity)
        ctx!!.resolve()
    }

    private fun clear() {
        if (mAd != null) {
            mAd = null
        }
    }
}
