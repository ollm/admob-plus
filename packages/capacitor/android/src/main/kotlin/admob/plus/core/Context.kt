package admob.plus.core

import com.google.android.libraries.ads.mobile.sdk.MobileAds
import com.google.android.libraries.ads.mobile.sdk.common.AdRequest
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError
import com.google.android.libraries.ads.mobile.sdk.common.RequestConfiguration
import com.google.android.libraries.ads.mobile.sdk.rewarded.ServerSideVerificationOptions
import org.json.JSONObject
import java.util.Objects

interface Context {
    fun has(name: String): Boolean
    fun opt(name: String): Any?
    fun optBoolean(name: String): Boolean?
    fun optDouble(name: String): Double?
    fun optDouble(name: String, defaultValue: Double): Double {
        return optDouble(name) ?: return defaultValue
    }

    fun optFloat(name: String): Float? {
        val v = optDouble(name) ?: return null
        return v.toFloat()
    }

    fun optInt(name: String): Int?
    fun optString(name: String): String?
    fun optStringList(name: String): List<String?>
    fun optObject(name: String): JSONObject?
    fun resolve()
    fun resolve(data: Boolean)
    fun reject(msg: String?)
    fun reject() {
        reject("unknown error")
    }

    fun reject(loadAdError: LoadAdError) {
        reject(loadAdError.message)
    }

    fun optId(): Int? {
        return optInt("id")
    }

    fun optAd(): Ad? {
        return Helper.getAd(optId())
    }

    fun optAdOrError(): Ad? {
        val ad = optAd()
        if (ad == null) {
            this.reject("Ad not found")
        }
        return ad
    }

    fun optAdUnitID(): String? {
        return optString("adUnitId")
    }

    fun optAppMuted(): Boolean? {
        return optBoolean("appMuted")
    }

    fun optAppVolume(): Float? {
        return optFloat("appVolume")
    }

    fun optPosition(): String? {
        return optString("position")
    }

    fun optAdRequest(): AdRequest {
        val builder = AdRequest.Builder(optAdUnitID() ?: "")
        if (has("contentUrl")) {
            Objects.requireNonNull(optString("contentUrl"))?.let { builder.setContentUrl(it) }
        }
        return builder.build()
    }

    fun optRequestConfiguration(): RequestConfiguration {
        val builder = RequestConfiguration.Builder()
        if (has("maxAdContentRating")) {
            when (optString("maxAdContentRating")) {
                "G" -> builder.setMaxAdContentRating(RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_G)
                "PG" -> builder.setMaxAdContentRating(RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_PG)
                "T" -> builder.setMaxAdContentRating(RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_T)
                "MA" -> builder.setMaxAdContentRating(RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_MA)
            }
        }
        val tagForChildDirectedTreatment = valueFromBool(
            this, "tagForChildDirectedTreatment",
            RequestConfiguration.TagForChildDirectedTreatment.TAG_FOR_CHILD_DIRECTED_TREATMENT_UNSPECIFIED,
            RequestConfiguration.TagForChildDirectedTreatment.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE,
            RequestConfiguration.TagForChildDirectedTreatment.TAG_FOR_CHILD_DIRECTED_TREATMENT_FALSE
        )
        if (tagForChildDirectedTreatment != null) {
            builder.setTagForChildDirectedTreatment(tagForChildDirectedTreatment)
        }
        val tagForUnderAgeOfConsent = valueFromBool(
            this, "tagForUnderAgeOfConsent",
            RequestConfiguration.TagForUnderAgeOfConsent.TAG_FOR_UNDER_AGE_OF_CONSENT_UNSPECIFIED,
            RequestConfiguration.TagForUnderAgeOfConsent.TAG_FOR_UNDER_AGE_OF_CONSENT_TRUE,
            RequestConfiguration.TagForUnderAgeOfConsent.TAG_FOR_UNDER_AGE_OF_CONSENT_FALSE
        )
        if (tagForUnderAgeOfConsent != null) {
            builder.setTagForUnderAgeOfConsent(tagForUnderAgeOfConsent)
        }
        if (has("testDeviceIds")) {
            builder.setTestDeviceIds(optStringList("testDeviceIds"))
        }
        return builder.build()
    }

    fun optServerSideVerificationOptions(): ServerSideVerificationOptions? {
        val param = "serverSideVerification"
        val serverSideVerification = optObject(param) ?: return null
        return ServerSideVerificationOptions(
            serverSideVerification.optString("userId"),
            serverSideVerification.optString("customData")
        )
    }

    fun configure(helper: Helper) {
        MobileAds.setRequestConfiguration(optRequestConfiguration())
        helper.configForTestLab()
        resolve()
    }

    companion object {
        fun <T> valueFromBool(ctx: Context, name: String, vNull: T, vTrue: T, vFalse: T): T? {
            if (!ctx.has(name)) return null
            val v = ctx.optBoolean(name) ?: return vNull
            return if (v) vTrue else vFalse
        }
    }
}
