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

        if let x = self.commandDelegate.settings["AdMobPlusWebViewAd".lowercased()] as? String,
           x == "true" {
            let webView = self.webViewEngine.engineWebView as! WKWebView
            MobileAds.shared.register(webView)
            // webView.reload()
        }

        if let x = self.commandDelegate.settings["AdMobPlusOverrideUrlLoading".lowercased()] as? String {
            overrideUrlLoading = x == "true"
        }
    }

    @objc func shouldOverrideLoadWithRequest(_ request: URLRequest, navigationType: CDVWebViewNavigationType, info: [AnyHashable: Any]) -> Bool {
        var allowNavigationsPass = true

        if overrideUrlLoading {
            if let url = request.url, url.scheme == "http" || url.scheme == "https" {
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
                    UIApplication.shared.open(url)
                }
            }
        }

        return allowNavigationsPass
    }
}
