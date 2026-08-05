// swift-tools-version:5.5

import PackageDescription

let package = Package(
    name: "admob-plus-cordova",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "admob-plus-cordova",
            targets: ["admob-plus-cordova"]
        )
    ],
    dependencies: [
        .package(
            url: "https://github.com/apache/cordova-ios.git",
            branch: "master"
        ),
        .package(
            name: "GoogleMobileAds",
            url: "https://github.com/googleads/swift-package-manager-google-mobile-ads.git",
            from: "13.7.0"
        )
    ],
    targets: [
        .target(
            name: "admob-plus-cordova",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "GoogleMobileAds", package: "GoogleMobileAds")
            ],
            path: "src/ios"
        )
    ]
)
