package admob.plus.core

import admob.plus.cordova.ads.AdSizeType
import android.annotation.SuppressLint
import android.app.Activity
import android.content.res.Resources
import android.provider.Settings
import android.util.DisplayMetrics
import com.google.android.libraries.ads.mobile.sdk.MobileAds
import com.google.android.libraries.ads.mobile.sdk.banner.AdSize
import com.google.android.libraries.ads.mobile.sdk.common.AdRequest
import com.google.android.libraries.ads.mobile.sdk.common.RequestConfiguration
import org.json.JSONArray
import org.json.JSONObject
import java.math.BigInteger
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.util.Locale
import kotlin.math.roundToInt

fun buildAdRequest(opts: JSONObject): AdRequest {
    val builder = AdRequest.Builder(opts.getString("adUnitId"))
    if (opts.has("contentUrl") && !opts.isNull("contentUrl")) {
        val contentUrl = opts.optString("contentUrl")
        if (contentUrl.isNotEmpty()) {
            builder.setContentUrl(contentUrl)
        }
    }
    return builder.build()
}

fun buildAdSize(opts: JSONObject, activity: Activity): AdSize {
    val name = "size"
    if (!opts.has(name)) {
        return AdSize.BANNER
    }
    val adSizeObj = opts.optJSONObject(name)
    val adSize = AdSizeType.getAdSize(opts.optInt(name))
    if (adSizeObj == null) {
        return adSize ?: AdSize.BANNER
    }
    val adaptive = adSizeObj.optString("adaptive")
    val w =
        pxToDp(if (adSizeObj.has("width")) adSizeObj.optInt("width") else Resources.getSystem().displayMetrics.widthPixels)
    if ("inline" == adaptive) {
        if (adSizeObj.has("maxHeight")) {
            return AdSize.getInlineAdaptiveBannerAdSize(
                w,
                pxToDp(adSizeObj.optInt("maxHeight"))
            )
        }
    } else {
        return when (adSizeObj.optString("orientation")) {
            "portrait" -> AdSize.getLargePortraitAnchoredAdaptiveBannerAdSize(
                activity, w
            )

            "landscape" -> AdSize.getLargeLandscapeAnchoredAdaptiveBannerAdSize(
                activity, w
            )

            else -> AdSize.getLargeAnchoredAdaptiveBannerAdSize(
                activity, w
            )
        }
    }
    return AdSize(w, pxToDp(adSizeObj.optInt("height")))
}

fun <T> optBooleanValue(opts: JSONObject, name: String, vNull: T, vTrue: T, vFalse: T): T? {
    if (!opts.has(name)) return null
    if (opts.isNull(name)) return vNull
    return if (opts.optBoolean(name)) vTrue else vFalse
}

fun JSONObject.optBooleanValue(name: String): Boolean? {
    if (!has(name) || isNull(name)) return null
    return optBoolean(name)
}

fun <T> optBooleanToInt(opts: JSONObject, name: String, vNull: T, vTrue: T, vFalse: T): T? {
    return optBooleanValue(opts, name, vNull, vTrue, vFalse)
}

fun optFloat(opts: JSONObject, name: String): Float? {
    if (!opts.has(name) || opts.isNull(name)) return null
    return opts.optDouble(name).toFloat()
}

fun buildRequestConfiguration(opts: JSONObject): RequestConfiguration {
    val builder = RequestConfiguration.Builder()
    if (opts.has("maxAdContentRating") && !opts.isNull("maxAdContentRating")) {
        val maxAdContentRating = opts.optString("maxAdContentRating")
        val rating = when (maxAdContentRating) {
            "G" -> RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_G
            "PG" -> RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_PG
            "T" -> RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_T
            "MA" -> RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_MA
            else -> null
        }
        rating?.let(builder::setMaxAdContentRating)
    }
    val childDirectedTreatment = opts.optBooleanValue("tagForChildDirectedTreatment")
    val underAgeOfConsent = opts.optBooleanValue("tagForUnderAgeOfConsent")
    if (childDirectedTreatment != null || underAgeOfConsent != null) {
        val ageRestrictedTreatment = when {
            childDirectedTreatment == true -> com.google.android.libraries.ads.mobile.sdk.common.AgeRestrictedTreatment.CHILD
            underAgeOfConsent == true -> com.google.android.libraries.ads.mobile.sdk.common.AgeRestrictedTreatment.TEEN
            else -> com.google.android.libraries.ads.mobile.sdk.common.AgeRestrictedTreatment.UNSPECIFIED
        }
        builder.setAgeRestrictedTreatment(ageRestrictedTreatment)
    }
    if (opts.has("testDeviceIds")) {
        builder.setTestDeviceIds(jsonArray2stringList(opts.optJSONArray("testDeviceIds")))
    }
    return builder.build()
}

fun configForTestLabIfNeeded(activity: Activity) {
    if (!isRunningInTestLab(activity)) {
        return
    }
    val config = MobileAds.getRequestConfiguration()
    val testDeviceIds = config.testDeviceIds.toMutableList()
    val deviceId = computeDeviceID(activity)
    if (deviceId in testDeviceIds) {
        return
    }
    testDeviceIds.add(deviceId)
    val builder = RequestConfiguration.Builder()
    builder.setMaxAdContentRating(config.maxAdContentRating)
    builder.setAgeRestrictedTreatment(config.ageRestrictedTreatment)
    builder.setTestDeviceIds(testDeviceIds)
    MobileAds.setRequestConfiguration(builder.build())
}

fun computeDeviceID(activity: Activity): String {
    // This will request test ads on the emulator and device by passing this hashed device ID.
    @SuppressLint("HardwareIds") val androidID = Settings.Secure.getString(
        activity.contentResolver, Settings.Secure.ANDROID_ID
    ) ?: ""
    return md5(androidID).uppercase(Locale.getDefault())
}

fun isRunningInTestLab(activity: Activity): Boolean {
    val testLabSetting =
        Settings.System.getString(activity.contentResolver, "firebase.test.lab")
    return "true" == testLabSetting
}

fun dpToPx(dp: Double): Double {
    return dp * Resources.getSystem().displayMetrics.density
}

fun pxToDp(px: Int): Int {
    val displayMetrics = Resources.getSystem().displayMetrics
    return (px / (displayMetrics.xdpi / DisplayMetrics.DENSITY_DEFAULT)).roundToInt()
}

fun jsonArray2stringList(a: JSONArray?): List<String> {
    val result: MutableList<String> = ArrayList()
    a?.let {
        for (i in 0 until it.length()) {
            it.optString(i)?.let { id ->
                result.add(id)
            }
        }
    }
    return result
}

fun md5(s: String): String {
    try {
        val digest = MessageDigest.getInstance("MD5")
        digest.update(s.toByteArray())
        val bigInt = BigInteger(1, digest.digest())
        return String.format("%32s", bigInt.toString(16)).replace(' ', '0')
    } catch (ignore: NoSuchAlgorithmException) {
    }
    return ""
}
