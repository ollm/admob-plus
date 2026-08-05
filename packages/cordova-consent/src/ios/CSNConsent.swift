#if canImport(AppTrackingTransparency)
    import AppTrackingTransparency
#endif
import Cordova
import UserMessagingPlatform

@objc(CSNConsent)
class CSNConsent: CDVPlugin {
    var readyCallbackId: String!

    override func pluginInitialize() {
        super.pluginInitialize()

        CSNContext.plugin = self
    }

    deinit {
        readyCallbackId = nil
        CSNContext.plugin = nil
    }

    @objc func ready(_ command: CDVInvokedUrlCommand) {
        readyCallbackId = command.callbackId

        self.emit(eventType: CSNEvents.ready)
    }

    @objc func canRequestAds(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)
        ctx.success(ConsentInformation.shared.canRequestAds)
    }

    @objc func privacyOptionsRequirementStatus(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)
        ctx.success(ConsentInformation.shared.privacyOptionsRequirementStatus.rawValue)
    }

    @objc func loadAndShowIfRequired(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)
        ConsentForm.loadAndPresentIfRequired(from: self.viewController) {
            [weak self] loadAndPresentError in
            guard self != nil else { return ctx.success() }

            if let consentError = loadAndPresentError {
                ctx.error(consentError)
                return
            }
            ctx.success()
        }
    }

    @objc func showPrivacyOptionsForm(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)
        ConsentForm.presentPrivacyOptionsForm(from: self.viewController) {
            [weak self] formError in
            guard self != nil, let formError else { return  ctx.success() }
            ctx.error(formError)
        }
    }

    @objc func trackingAuthorizationStatus(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)

        if #available(iOS 14, *) {
            ctx.success(ATTrackingManager.trackingAuthorizationStatus.rawValue)
        } else {
            ctx.success(false)
        }
    }

    @objc func requestTrackingAuthorization(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)

        if #available(iOS 14, *) {
            ATTrackingManager.requestTrackingAuthorization(completionHandler: { status in
                ctx.success(status.rawValue)
            })
        } else {
            ctx.success(false)
        }
    }

    @objc func requestInfoUpdate(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)

        ConsentInformation.shared.requestConsentInfoUpdate(
            with: ctx.optUMPRequestParameters(),
            completionHandler: { error in
              if error != nil {
                ctx.error(error!)
              } else {
                ctx.success()
              }
            })
    }

    @objc func getFormStatus(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)
        ctx.success(ConsentInformation.shared.formStatus.rawValue)
    }

    @objc func getConsentStatus(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)
        ctx.success(ConsentInformation.shared.consentStatus.rawValue)
    }

    @objc func loadForm(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)

        Task { @MainActor in
            do {
                let form = try await ConsentForm.load()
                let id = form.hashValue % (2 << 30)
                CSNContext.forms[id] = form
                ctx.success(id)
            } catch {
                ctx.error(error)
            }
        }
    }

    @objc func showForm(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)

        if let form = ctx.optForm() {
            form.present(
                from: self.viewController,
                completionHandler: { dismissError in
                    if dismissError != nil {
                        ctx.error(dismissError!)
                    } else {
                        ctx.success()
                    }
                })
        } else {
            ctx.error("Form not found")
        }
    }

    @objc func reset(_ command: CDVInvokedUrlCommand) {
        let ctx = CSNContext(command)
        ConsentInformation.shared.reset()
        ctx.success()
    }

    func emit(eventType: String, data: Any = NSNull()) {
        let result: CDVPluginResult? = CDVPluginResult(status: .ok, messageAs: ["type": eventType, "data": data])
        result?.setKeepCallbackAs(true)
        self.commandDelegate.send(result, callbackId: readyCallbackId)
    }
}
