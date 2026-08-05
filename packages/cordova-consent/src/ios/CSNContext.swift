import Cordova
import UserMessagingPlatform

class CSNContext {
    static var forms = [Int: ConsentForm]()
    static weak var plugin: CSNConsent!

    let command: CDVInvokedUrlCommand

    init(_ command: CDVInvokedUrlCommand) {
        self.command = command
    }

    var plugin: CSNConsent {
        return CSNContext.plugin
    }

    var commandDelegate: CDVCommandDelegate {
        return plugin.commandDelegate
    }

    func opt0() -> Any? {
        return command.argument(at: 0)
    }

    lazy var opts: NSDictionary? = {
        return opt0() as? NSDictionary
    }()

    func opt(_ key: String) -> Any? {
        return opts?.value(forKey: key)
    }

    func optId() -> Int? {
        return opt("id") as? Int
    }

    func optForm() -> ConsentForm? {
        if let id = optId() {
            return CSNContext.forms[id]
        }
        return nil
    }

    func optDebugGeography() -> DebugGeography? {
        if let value = opt("debugGeography") as? Int {
            return DebugGeography(rawValue: value)
        }
        return nil
    }

    func optTestDeviceIds() -> [String]? {
        if let testDeviceIds = opt("testDeviceIds") as? [String] {
            return testDeviceIds
        }
        return nil
    }

    func optUMPDebugSettings() -> DebugSettings {
        let debugSettings = DebugSettings()

        if let debugGeography = optDebugGeography() {
            debugSettings.geography = debugGeography
        }

        if let testDeviceIds = optTestDeviceIds() {
            debugSettings.testDeviceIdentifiers = testDeviceIds
        }

        return debugSettings
    }

    func optUMPRequestParameters() -> RequestParameters {
        let parameters = RequestParameters()

        if let tagForUnderAgeOfConsent = opt("tagForUnderAgeOfConsent") as? Bool {
            parameters.isTaggedForUnderAgeOfConsent = tagForUnderAgeOfConsent
        }

        parameters.debugSettings = optUMPDebugSettings()

        return parameters
    }

    func sendResult(_ message: CDVPluginResult?) {
        self.commandDelegate.send(message, callbackId: command.callbackId)
    }

    func success() {
        self.sendResult(CDVPluginResult(status: .ok))
    }

    func success(_ message: Bool) {
        self.sendResult(CDVPluginResult(status: .ok, messageAs: message))
    }

    func success(_ message: Int) {
        self.sendResult(CDVPluginResult(status: .ok, messageAs: message))
    }

    func success(_ message: UInt) {
        self.sendResult(CDVPluginResult(status: .ok, messageAs: message))
    }

    func success(_ message: [String: Any]) {
        self.sendResult(CDVPluginResult(status: .ok, messageAs: message))
    }

    func error() {
        self.sendResult(CDVPluginResult(status: .error))
    }

    func error(_ message: String?) {
        self.sendResult(CDVPluginResult(status: .error, messageAs: message))
    }

    func error(_ message: Error?) {
        self.error(message?.localizedDescription)
    }
}
