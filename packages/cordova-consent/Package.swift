// swift-tools-version:5.5

import PackageDescription

let package = Package(
    name: "cordova-plugin-consent",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "cordova-plugin-consent",
            targets: ["cordova-plugin-consent"]
        )
    ],
    dependencies: [
        .package(
            url: "https://github.com/apache/cordova-ios.git",
            branch: "master"
        ),
        .package(
            name: "GoogleUserMessagingPlatform",
            url: "https://github.com/googleads/swift-package-manager-google-user-messaging-platform.git",
            from: "3.1.0"
        )
    ],
    targets: [
        .target(
            name: "cordova-plugin-consent",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "GoogleUserMessagingPlatform", package: "GoogleUserMessagingPlatform")
            ],
            path: "src/ios"
        )
    ]
)
