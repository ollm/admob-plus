import Cordova
import Foundation
import GoogleMobileAds
import UIKit
import WebKit

@objc(AdMobWebviewAdPlugin)
class AdMobWebviewAdPlugin: CDVPlugin, CDVPluginNavigationHandler {

    var overrideUrlLoading: Bool = true

    override func pluginInitialize() {
        super.pluginInitialize()

        NSLog("[AdMobWebViewAd] Initialize plugin")

        if let x = self.commandDelegate.settings["AdMobPlusWebViewAd".lowercased()] as? String,
           x == "true" {
            let webView = self.webViewEngine.engineWebView as! WKWebView
            MobileAds.shared.register(webView)
            NSLog("[AdMobWebViewAd] Registered WebView API for Ads")
            // webView.reload()
        } else {
            NSLog("[AdMobWebViewAd] WebView API for Ads is disabled or not configured")
        }

        if let x = self.commandDelegate.settings["AdMobPlusOverrideUrlLoading".lowercased()] as? String {
            overrideUrlLoading = x == "true"
        }
        NSLog("[AdMobWebViewAd] Override URL loading: \(overrideUrlLoading)")
    }

    @objc func shouldOverrideLoad(with request: URLRequest, navigationType: CDVWebViewNavigationType, info: [AnyHashable: Any]) -> Bool {
        var allowNavigationsPass = true

        guard let url = request.url else {
            NSLog("[AdMobWebViewAd] Navigation request has no URL")
            return allowNavigationsPass
        }

        NSLog("[AdMobWebViewAd] Navigation request: url=\(url.absoluteString), type=\(navigationType), override=\(overrideUrlLoading)")

        if overrideUrlLoading {
            if url.scheme == "http" || url.scheme == "https" {
                let webView = self.webViewEngine.engineWebView as? WKWebView
                let isInitialOrCurrentPage = webView?.url == nil || webView?.url == url

                if info["sourceFrame"] == nil && !isInitialOrCurrentPage {
                    allowNavigationsPass = false
                }

                switch navigationType {
                case CDVWebViewNavigationType(WKNavigationType.linkActivated.rawValue):
                    allowNavigationsPass = false
                case CDVWebViewNavigationType(WKNavigationType.other.rawValue):
                    if url.absoluteString.range(of: "utm_content") != nil {
                        allowNavigationsPass = false
                    }
                default:
                    break
                }

                // Allow webviewGoto urls to pass
                if url.absoluteString.range(of: "from_webview_goto") != nil {
                    allowNavigationsPass = true
                }

                if !allowNavigationsPass {
                    NSLog("[AdMobWebViewAd] Opening URL in external browser: \(url.absoluteString)")
                    DispatchQueue.main.async {
                        guard UIApplication.shared.canOpenURL(url) else {
                            NSLog("[AdMobWebViewAd] Cannot open URL: \(url.absoluteString)")
                            return
                        }

                        UIApplication.shared.open(url, options: [:]) { success in
                            NSLog("[AdMobWebViewAd] External URL open result: \(success), url=\(url.absoluteString)")
                        }
                    }
                } else {
                    NSLog("[AdMobWebViewAd] Allowing URL in WebView: \(url.absoluteString)")
                }
            } else {
                NSLog("[AdMobWebViewAd] Non HTTP(S) URL passed to WebView: \(url.absoluteString)")
            }
        }

        return allowNavigationsPass
    }
}
