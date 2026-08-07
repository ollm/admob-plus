package admob.plus.rn.ads;

import androidx.annotation.NonNull;

import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback;
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError;
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError;
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAd;
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAdEventCallback;

import admob.plus.core.Context;
import admob.plus.core.GenericAd;
import admob.plus.rn.ExecuteContext;
import admob.plus.rn.Generated.Events;

public class Interstitial extends AdBase implements GenericAd {
    private InterstitialAd mAd = null;

    public Interstitial(ExecuteContext ctx) {
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

        InterstitialAd.load(ctx.optAdRequest(), new AdLoadCallback<InterstitialAd>() {
            @Override
            public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                mAd = interstitialAd;

                mAd.adEventCallback = new InterstitialAdEventCallback() {
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

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                mAd = null;
                emit(Events.AD_LOAD_FAIL, loadAdError);
                ctx.reject(loadAdError);
            }
        });
    }

    @Override
    public boolean isLoaded() {
        return mAd != null;
    }

    @Override
    public void show(Context ctx) {
        mAd.show(getAdapter().getActivity());
        ctx.resolve();
    }

    private void clear() {
        if (mAd != null) {
            mAd.adEventCallback = null;
            mAd = null;
        }
    }
}
