package admob.plus.core;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.libraries.ads.mobile.sdk.MobileAds;
import com.google.android.libraries.ads.mobile.sdk.common.AdRequest;
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError;
import com.google.android.libraries.ads.mobile.sdk.common.RequestConfiguration;
import com.google.android.libraries.ads.mobile.sdk.rewarded.ServerSideVerificationOptions;

import org.json.JSONObject;

import java.util.List;
import java.util.Objects;

public interface Context {
    @Nullable
    static <T> T valueFromBool(Context ctx, String name, T vNull, T vTrue, T vFalse) {
        if (!ctx.has(name)) return null;
        final Boolean v = ctx.optBoolean(name);
        if (v == null) return vNull;
        return v ? vTrue : vFalse;
    }

    boolean has(@NonNull String name);

    @Nullable
    Object opt(@NonNull String name);

    @Nullable
    Boolean optBoolean(@NonNull String name);

    @Nullable
    Double optDouble(@NonNull String name);

    default double optDouble(@NonNull String name, double defaultValue) {
        final Double v = optDouble(name);
        if (v == null) return defaultValue;
        return v;
    }

    @Nullable
    default Float optFloat(@NonNull String name) {
        final Double v = optDouble(name);
        if (v == null) return null;
        return v.floatValue();
    }

    @Nullable
    Integer optInt(@NonNull String name);

    @Nullable
    String optString(@NonNull String name);

    @NonNull
    List<String> optStringList(@NonNull String name);

    @Nullable
    JSONObject optObject(@NonNull String name);

    void resolve();

    void resolve(boolean data);

    void reject(String msg);

    default void reject() {
        reject("unknown error");
    }

    default void reject(@NonNull LoadAdError loadAdError) {
        reject(loadAdError.getMessage());
    }

    @Nullable
    default Integer optId() {
        return this.optInt("id");
    }

    @Nullable
    default Ad optAd() {
        return Helper.getAd(optId());
    }

    @Nullable
    default Ad optAdOrError() {
        Ad ad = optAd();
        if (ad == null) {
            this.reject("Ad not found");
        }
        return ad;
    }

    @Nullable
    default String optAdUnitID() {
        return this.optString("adUnitId");
    }

    @Nullable
    default Boolean optAppMuted() {
        return this.optBoolean("appMuted");
    }

    @Nullable
    default Float optAppVolume() {
        return this.optFloat("appVolume");
    }

    @Nullable
    default String optPosition() {
        return this.optString("position");
    }

    @NonNull
    default AdRequest optAdRequest() {
        AdRequest.Builder builder = new AdRequest.Builder(Objects.requireNonNull(optAdUnitID()));
        if (this.has("contentUrl")) {
            builder.setContentUrl(Objects.requireNonNull(this.optString("contentUrl")));
        }
        return builder.build();
    }

    @NonNull
    default RequestConfiguration optRequestConfiguration() {
        final RequestConfiguration.Builder builder = new RequestConfiguration.Builder();
        if (this.has("maxAdContentRating")) {
            switch (this.optString("maxAdContentRating")) {
                case "G": builder.setMaxAdContentRating(RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_G); break;
                case "PG": builder.setMaxAdContentRating(RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_PG); break;
                case "T": builder.setMaxAdContentRating(RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_T); break;
                case "MA": builder.setMaxAdContentRating(RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_MA); break;
            }
        }
        final RequestConfiguration.TagForChildDirectedTreatment tagForChildDirectedTreatment = valueFromBool(this, "tagForChildDirectedTreatment",
                RequestConfiguration.TagForChildDirectedTreatment.TAG_FOR_CHILD_DIRECTED_TREATMENT_UNSPECIFIED,
                RequestConfiguration.TagForChildDirectedTreatment.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE,
                RequestConfiguration.TagForChildDirectedTreatment.TAG_FOR_CHILD_DIRECTED_TREATMENT_FALSE);
        if (tagForChildDirectedTreatment != null) {
            builder.setTagForChildDirectedTreatment(tagForChildDirectedTreatment);
        }
        final RequestConfiguration.TagForUnderAgeOfConsent tagForUnderAgeOfConsent = valueFromBool(this, "tagForUnderAgeOfConsent",
                RequestConfiguration.TagForUnderAgeOfConsent.TAG_FOR_UNDER_AGE_OF_CONSENT_UNSPECIFIED,
                RequestConfiguration.TagForUnderAgeOfConsent.TAG_FOR_UNDER_AGE_OF_CONSENT_TRUE,
                RequestConfiguration.TagForUnderAgeOfConsent.TAG_FOR_UNDER_AGE_OF_CONSENT_FALSE);
        if (tagForUnderAgeOfConsent != null) {
            builder.setTagForUnderAgeOfConsent(tagForUnderAgeOfConsent);
        }
        if (this.has("testDeviceIds")) {
            builder.setTestDeviceIds(this.optStringList("testDeviceIds"));
        }
        return builder.build();
    }

    @Nullable
    default ServerSideVerificationOptions optServerSideVerificationOptions() {
        final String param = "serverSideVerification";
        JSONObject serverSideVerification = this.optObject(param);
        if (serverSideVerification == null) return null;

        return new ServerSideVerificationOptions(
                serverSideVerification.optString("userId"),
                serverSideVerification.optString("customData"));
    }

    default void configure(Helper helper) {
        MobileAds.setRequestConfiguration(optRequestConfiguration());
        helper.configForTestLab();
        resolve();
    }
}
