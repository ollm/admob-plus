package admob.plus.cordova.webviewad

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.util.Log
import android.webkit.WebView
import com.google.android.libraries.ads.mobile.sdk.MobileAds
import com.google.android.libraries.ads.mobile.sdk.initialization.InitializationConfig
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaInterface
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.CordovaWebView
import org.json.JSONArray
import org.json.JSONException

class Plugin : CordovaPlugin() {
    private val isWebviewAdEnabled: Boolean by lazy {
        preferences.getBoolean("AdMobPlusWebViewAd", true)
    }

    private val isOverrideUrlLoadingEnabled: Boolean by lazy {
        preferences.getBoolean("AdMobPlusOverrideUrlLoading", true)
    }

    @Deprecated("Required by the CordovaPlugin lifecycle")
    @Suppress("DEPRECATION")
    override fun initialize(cordova: CordovaInterface, cordovaWebView: CordovaWebView) {
        cordova.activity.runOnUiThread {
            if (isWebviewAdEnabled) {
                val webView = cordovaWebView.view as WebView
                val appId = cordova.activity.packageManager
                    .getApplicationInfo(
                        cordova.activity.packageName,
                        PackageManager.GET_META_DATA
                    )
                    .metaData?.getString(APP_ID_METADATA_KEY)
                if (appId == null) {
                    Log.e(TAG, "Unable to initialize Mobile Ads: app ID is missing")
                    return@runOnUiThread
                }
                MobileAds.initialize(
                    cordova.activity,
                    InitializationConfig.Builder(appId).build()
                ) {
                    cordova.activity.runOnUiThread {
                        MobileAds.registerWebView(webView)
                        webView.reload()
                        Log.d(TAG, "Integrated the WebView API for Ads in ${webView.url} WebView")
                    }
                }
            }
        }
        super.initialize(cordova, cordovaWebView)
    }

    override fun pluginInitialize() {
        super.pluginInitialize()
        Log.i(TAG, "Initialize plugin")
    }

    @Throws(JSONException::class)
    override fun execute(
        action: String,
        data: JSONArray,
        callbackContext: CallbackContext
    ): Boolean {
        return false
    }

    override fun onOverrideUrlLoading(url: String): Boolean {
        if (!isOverrideUrlLoadingEnabled) return super.onOverrideUrlLoading(url)

        Log.d(TAG, "onOverrideUrlLoading called with URL $url")
        return try {
            val intent = Intent(Intent.ACTION_VIEW)
            // Omitting the MIME type for file: URLs causes "No Activity found to handle Intent".
            // Adding the MIME type to http: URLs causes them to not be handled by the downloader.
            val uri = Uri.parse(url)
            intent.setData(uri)
            if (uri.scheme in setOf("http", "https") && url != webView.url) {
                cordova.activity.startActivity(intent)
                Log.d(TAG, "Open Iframe URL to browser $url")
            } else {
                return false
            }
            true // true prevents navigation navigation
        } catch (e: android.content.ActivityNotFoundException) {
            Log.d(TAG, "onOverrideUrlLoading: Error loading url $url:$e")
            false
        }
    }

    companion object {
        private const val TAG = "AdMobWebViewAd"
        private const val APP_ID_METADATA_KEY = "com.google.android.gms.ads.APPLICATION_ID"
    }
}
