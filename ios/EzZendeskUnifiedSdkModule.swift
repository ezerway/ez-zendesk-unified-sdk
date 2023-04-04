import ExpoModulesCore
import ChatSDK
import MessagingSDK
import ZendeskCoreSDK
import SupportProvidersSDK
import AnswerBotProvidersSDK
import ChatProvidersSDK

public class EzZendeskUnifiedSdkModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('EzZendeskUnifiedSdk')` in JavaScript.
    Name("EzZendeskUnifiedSdk")

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    AsyncFunction("init") { (subdomainUrl: String, applicationId: String, oauthClientId: String) -> Bool in
      Logger.isEnabled = true
      Zendesk.initialize(appId: applicationId,
                          clientId: oauthClientId,
                          zendeskUrl: subdomainUrl)
        
      Zendesk.instance?.setIdentity(Identity.createAnonymous(name: "End User", email: "end.user@domain.com"))
      Support.initialize(withZendesk: Zendesk.instance)
      AnswerBot.initialize(withZendesk: Zendesk.instance, support: Support.instance!)
      return true
    }.runOnQueue(.main)

    AsyncFunction("show") { () in
      let answerBotEngine = try AnswerBotEngine.engine()
      let supportEngine = try SupportEngine.engine()
      let chatEngine = try ChatEngine.engine()
   
      // Build view controller
      let viewController = try Messaging.instance.buildUI(engines: [answerBotEngine, supportEngine, chatEngine], configs: [])
      let chatEngine = try ChatEngine.engine()

      // Present view controller
      if var topController = UIApplication.sharedApplication().keyWindow?.rootViewController {
          while let presentedViewController = topController.presentedViewController {
              topController = presentedViewController
          }

          // topController should now be your topmost view controller
          topController?.pushViewController(viewController, animated: true)
      }
    }.runOnQueue(.main)

    AsyncFunction("setIdentity") { (name: String, email: String) in
      Zendesk.instance?.setIdentity(Identity.createAnonymous(name: name, email: email))
    }.runOnQueue(.main)
  }
}
