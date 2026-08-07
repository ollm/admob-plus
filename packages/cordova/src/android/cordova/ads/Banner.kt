package admob.plus.cordova.ads

import admob.plus.cordova.Events
import admob.plus.cordova.ExecuteContext
import admob.plus.core.buildAdSize
import admob.plus.core.pxToDp
import android.annotation.SuppressLint
import android.content.res.Configuration
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.widget.LinearLayout
import android.widget.RelativeLayout
import com.google.android.libraries.ads.mobile.sdk.banner.AdSize
import com.google.android.libraries.ads.mobile.sdk.banner.AdView
import com.google.android.libraries.ads.mobile.sdk.banner.BannerAd
import com.google.android.libraries.ads.mobile.sdk.banner.BannerAdEventCallback
import com.google.android.libraries.ads.mobile.sdk.banner.BannerAdRequest
import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError
import org.json.JSONObject

enum class AdSizeType {
    BANNER, LARGE_BANNER, MEDIUM_RECTANGLE, FULL_BANNER, LEADERBOARD, SMART_BANNER;

    companion object {
        fun getAdSize(adSize: Int): AdSize? {
            return when (values()[adSize]) {
                BANNER -> AdSize.BANNER
                LARGE_BANNER -> AdSize.LARGE_BANNER
                MEDIUM_RECTANGLE -> AdSize.MEDIUM_RECTANGLE
                FULL_BANNER -> AdSize.FULL_BANNER
                LEADERBOARD -> AdSize.LEADERBOARD
                SMART_BANNER -> AdSize.BANNER
            }
        }
    }
}

fun buildGravity(opts: JSONObject): Int {
    return if ("top" == opts.optString("position")) Gravity.TOP else Gravity.BOTTOM
}

fun buildOffset(opts: JSONObject): Int {
    return opts.optInt("offset", 0)
}

class Banner(ctx: ExecuteContext) : AdBase(ctx) {
    private val adSize: AdSize
    private val gravity: Int
    private val offset: Int
    private var mAdView: AdView? = null
    private var mRelativeLayout: RelativeLayout? = null
    private var mAdViewOld: AdView? = null

    override val isLoaded: Boolean
        get() = mAdView != null

    init {
        adSize = buildAdSize(initOpts, ctx.activity)
        gravity = buildGravity(initOpts)
        offset = buildOffset(initOpts)
    }

    override fun load(ctx: ExecuteContext) {
        if (mAdView == null) {
            mAdView = createBannerView()
        }
        mAdView!!.loadAd(
            BannerAdRequest.Builder(adUnitId, adSize).build(),
            object : AdLoadCallback<BannerAd> {
                override fun onAdLoaded(ad: BannerAd) {
                    ad.adEventCallback = object : BannerAdEventCallback {
                        override fun onAdClicked() = emit(Events.AD_CLICK)
                        override fun onAdImpression() = emit(Events.AD_IMPRESSION)
                    }
                    emit(Events.AD_LOAD, computeAdSize())
                }

                override fun onAdFailedToLoad(adError: LoadAdError) {
                    emit(Events.AD_LOAD_FAIL, adError)
                }
            },
        )
        ctx.resolve()
    }

    private fun createBannerView(): AdView {
        val adView = AdView(plugin.activity)
        return adView
    }

    private fun computeAdSize(): Map<String, Any> {
        val width = mAdView!!.width
        val height = mAdView!!.height
        return mapOf(
            "size" to mapOf(
                "width" to pxToDp(width),
                "height" to pxToDp(height),
                "widthInPixels" to width,
                "heightInPixels" to height,
            )
        )
    }

    override fun show(ctx: ExecuteContext) {
        if (mAdView!!.parent == null) {
            addBannerView()
            mAdView!!.post {
                if (mAdView!!.width > 0 && mAdView!!.height > 0) {
                    emit(Events.BANNER_SIZE, computeAdSize())
                }
            }
        } else if (mAdView!!.visibility == View.GONE) {
            mAdView!!.visibility = View.VISIBLE
        } else {
            val wvParentView = getParentView(webView)
            if (rootLinearLayout !== wvParentView) {
                removeFromParentView(rootLinearLayout)
                addBannerView()
            }
        }
        ctx.resolve()
    }

    override fun hide(ctx: ExecuteContext) {
        if (mAdView != null) {
            mAdView!!.visibility = View.GONE
        }
        ctx.resolve()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val w = plugin.activity.resources.displayMetrics.widthPixels
        if (w != screenWidth) {
            screenWidth = w
            plugin.activity.runOnUiThread { reloadBannerView() }
        }
    }

    private fun reloadBannerView() {
        if (mAdView == null || mAdView!!.visibility == View.GONE) return
        pauseBannerViews()
        if (mAdViewOld != null) removeBannerView(mAdViewOld!!)
        mAdViewOld = mAdView
        mAdView = createBannerView()
        mAdView!!.loadAd(BannerAdRequest.Builder(adUnitId, adSize).build(), object : AdLoadCallback<BannerAd> {
            override fun onAdLoaded(ad: BannerAd) {
                emit(Events.AD_LOAD, computeAdSize())
            }

            override fun onAdFailedToLoad(adError: LoadAdError) {
                emit(Events.AD_LOAD_FAIL, adError)
            }
        })
        addBannerView()
    }

    override fun onPause(multitasking: Boolean) {
        pauseBannerViews()
        super.onPause(multitasking)
    }

    private fun pauseBannerViews() {
        mAdView?.visibility = View.GONE
        if (mAdViewOld != null && mAdViewOld != mAdView) mAdViewOld!!.visibility = View.GONE
    }

    override fun onResume(multitasking: Boolean) {
        super.onResume(multitasking)
        resumeBannerViews()
    }

    private fun resumeBannerViews() {
        mAdView?.visibility = View.VISIBLE
        if (mAdViewOld != null && mAdViewOld != mAdView) mAdViewOld!!.visibility = View.VISIBLE
    }

    override fun onDestroy() {
        if (mAdView != null) {
            removeBannerView(mAdView!!)
            mAdView = null
        }
        if (mAdViewOld != null) {
            removeBannerView(mAdViewOld!!)
            mAdViewOld = null
        }
        if (mRelativeLayout != null) {
            removeFromParentView(mRelativeLayout)
            mRelativeLayout = null
        }
        super.onDestroy()
    }

    private fun removeBannerView(adView: AdView) {
        removeFromParentView(adView)
        adView.removeAllViews()
        adView.destroy()
    }

    private fun addBannerView() {
        if (mAdView == null) return
        if (getParentView(mAdView) === mRelativeLayout && mRelativeLayout != null) return
        addBannerViewWithRelativeLayout()
        plugin.contentView?.let {
            it.bringToFront()
            it.requestLayout()
            it.requestFocus()
        }
    }

    private fun addBannerViewWithLinearLayout() {
        val wvParentView = getParentView(webView)
        if (rootLinearLayout == null) {
            rootLinearLayout = LinearLayout(plugin.activity)
        }
        if (wvParentView != null && wvParentView !== rootLinearLayout) {
            wvParentView.removeView(webView)
            val content = rootLinearLayout as LinearLayout?
            content!!.orientation = LinearLayout.VERTICAL
            rootLinearLayout!!.layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
                0.0f
            )
            webView.layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
                1.0f
            )
            rootLinearLayout!!.addView(webView)
            val view = getParentView(rootLinearLayout)
            if (view !== wvParentView) {
                removeFromParentView(rootLinearLayout)
                wvParentView.addView(rootLinearLayout)
            }
        }
        removeFromParentView(mAdView)
        if (isPositionTop) {
            rootLinearLayout!!.addView(mAdView, 0)
        } else {
            rootLinearLayout!!.addView(mAdView)
        }
        plugin.contentView?.let {
            for (i in 0 until it.childCount) {
                val view = it.getChildAt(i)
                (view as? RelativeLayout)?.bringToFront()
            }
        }
    }

    private fun addBannerViewWithRelativeLayout() {
        val paramsContent = RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT
        )
        paramsContent.addRule(if (isPositionTop) RelativeLayout.ALIGN_PARENT_TOP else RelativeLayout.ALIGN_PARENT_BOTTOM)
        if (mRelativeLayout == null) {
            mRelativeLayout = RelativeLayout(plugin.activity)
            val params = RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT
            )
            if (isPositionTop) {
                params.setMargins(0, offset!!, 0, 0)
            } else {
                params.setMargins(0, 0, 0, offset!!)
            }
            plugin.contentView?.addView(mRelativeLayout, params)
                ?: Log.e(TAG, "Unable to find content view")
        }
        removeFromParentView(mAdView)
        mRelativeLayout!!.addView(mAdView, paramsContent)
        mRelativeLayout!!.bringToFront()
    }

    private val isPositionTop: Boolean
        get() = gravity == Gravity.TOP

    enum class AdSizeType {
        BANNER, LARGE_BANNER, MEDIUM_RECTANGLE, FULL_BANNER, LEADERBOARD, SMART_BANNER;

        companion object {
            fun getAdSize(adSize: Int): AdSize? {
                return when (values()[adSize]) {
                    BANNER -> AdSize.BANNER
                    LARGE_BANNER -> AdSize.LARGE_BANNER
                    MEDIUM_RECTANGLE -> AdSize.MEDIUM_RECTANGLE
                    FULL_BANNER -> AdSize.FULL_BANNER
                    LEADERBOARD -> AdSize.LEADERBOARD
                    SMART_BANNER -> AdSize.BANNER
                }
            }
        }
    }

    companion object {
        private const val TAG = "AdMobPlus.Banner"

        @SuppressLint("StaticFieldLeak")
        private var rootLinearLayout: ViewGroup? = null
        private var screenWidth = 0
        fun destroyParentView() {
            try {
                val vg = getParentView(rootLinearLayout)
                vg?.removeAllViews()
            } finally {
                rootLinearLayout = null
            }
        }

        private fun runJustBeforeBeingDrawn(view: View, runnable: Runnable) {
            val preDrawListener: ViewTreeObserver.OnPreDrawListener =
                object : ViewTreeObserver.OnPreDrawListener {
                    override fun onPreDraw(): Boolean {
                        view.viewTreeObserver.removeOnPreDrawListener(this)
                        runnable.run()
                        return true
                    }
                }
            view.viewTreeObserver.addOnPreDrawListener(preDrawListener)
        }
    }
}