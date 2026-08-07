package admob.plus.rn.ads;

import androidx.annotation.NonNull;

import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback;
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError;
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError;
import com.google.android.libraries.ads.mobile.sdk.rewarded.OnUserEarnedRewardListener;
import com.google.android.libraries.ads.mobile.sdk.rewarded.ServerSideVerificationOptions;
import com.google.android.libraries.ads.mobile.sdk.rewardedinterstitial.RewardedInterstitialAd;
import com.google.android.libraries.ads.mobile.sdk.rewardedinterstitial.RewardedInterstitialAdEventCallback;

import admob.plus.core.Context;
import admob.plus.core.GenericAd;
import admob.plus.rn.ExecuteContext;
import admob.plus.rn.Generated.Events;

public class RewardedInterstitial extends AdBase implements GenericAd {
    private RewardedInterstitialAd mAd = null;

    public RewardedInterstitial(ExecuteContext ctx) {
        super(ctx);
    }

    @Override
    public void destroy() {
        clear();

        super.destroy();
    }

    @Override
    public void load(Context ctx) {
        clear();

        RewardedInterstitialAd.load(ctx.optAdRequest(), new AdLoadCallback<RewardedInterstitialAd>() {
            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                emit(Events.AD_LOAD_FAIL, loadAdError);
                ctx.reject(loadAdError);
            }

            @Override
            public void onAdLoaded(@NonNull RewardedInterstitialAd rewardedAd) {
                mAd = rewardedAd;
                ServerSideVerificationOptions ssv = ctx.optServerSideVerificationOptions();
                if (ssv != null) {
                    mAd.setServerSideVerificationOptions(ssv);
                }
                mAd.adEventCallback = new RewardedInterstitialAdEventCallback() {
                    @Override
                    public void onAdDismissedFullScreenContent() {
                        clear();
                        emit(Events.AD_DISMISS);
                    }

                    @Override
                    public void onAdFailedToShowFullScreenContent(FullScreenContentError adError) {
                        clear();
                        emit(Events.AD_SHOW_FAIL, adError);
                    }

                    @Override
                    public void onAdShowedFullScreenContent() {
                        emit(Events.AD_SHOW);
                    }

                    @Override
                    public void onAdImpression() {
                        emit(Events.AD_IMPRESSION);
                    }
                });

                emit(Events.AD_LOAD);
                ctx.resolve();
            }
        });
    }

    @Override
    public boolean isLoaded() {
        return mAd != null;
    }

    @Override
    public void show(Context ctx) {
        mAd.show(getAdapter().getActivity(), (OnUserEarnedRewardListener) rewardItem -> {
            emit(Events.AD_REWARD, rewardItem);
        });
        ctx.resolve();
    }

    private void clear() {
        if (mAd != null) {
            mAd = null;
        }
    }
}
