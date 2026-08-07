package admob.plus.cordova.ads

import admob.plus.cordova.Events
import admob.plus.cordova.ExecuteContext
import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError
import com.google.android.libraries.ads.mobile.sdk.rewarded.OnUserEarnedRewardListener
import com.google.android.libraries.ads.mobile.sdk.rewarded.RewardItem
import com.google.android.libraries.ads.mobile.sdk.rewardedinterstitial.RewardedInterstitialAd
import com.google.android.libraries.ads.mobile.sdk.rewardedinterstitial.RewardedInterstitialAdEventCallback

class RewardedInterstitial(ctx: ExecuteContext) : AdBase(ctx) {
    private var mAd: RewardedInterstitialAd? = null
    override fun onDestroy() {
        clear()
        super.onDestroy()
    }

    override fun load(ctx: ExecuteContext) {
        clear()
        RewardedInterstitialAd.load(
            adRequest,
            object : AdLoadCallback<RewardedInterstitialAd> {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                    mAd = null
                    emit(Events.AD_LOAD_FAIL, adError)
                    ctx.reject(adError.toString())
                }

                override fun onAdLoaded(ad: RewardedInterstitialAd) {
                    mAd = ad
                    val ssv = buildServerSideVerificationOptions(initOpts)
                    if (ssv != null) {
                        mAd!!.setServerSideVerificationOptions(ssv)
                    }
                    mAd!!.adEventCallback = object : RewardedInterstitialAdEventCallback {
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
            })
    }

    override val isLoaded: Boolean
        get() = mAd != null

    override fun show(ctx: ExecuteContext) {
        if (this.isLoaded) {
            mAd!!.show(plugin.activity, OnUserEarnedRewardListener { rewardItem: RewardItem ->
                emit(Events.AD_REWARD, rewardItem)
            })
            ctx.resolve()
        } else {
            ctx.reject("Ad is not loaded")
        }
    }

    private fun clear() {
        if (mAd != null) {
            mAd = null
        }
    }
}
