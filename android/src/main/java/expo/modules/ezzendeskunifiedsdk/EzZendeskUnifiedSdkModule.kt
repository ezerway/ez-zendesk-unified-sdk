package expo.modules.ezzendeskunifiedsdk

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Context
import zendesk.core.Zendesk
import zendesk.core.AnonymousIdentity
import zendesk.classic.messaging.MessagingActivity
import zendesk.support.Support
import zendesk.support.SupportEngine
import zendesk.answerbot.AnswerBot
import zendesk.answerbot.AnswerBotEngine
import zendesk.chat.ChatEngine
import com.zendesk.logger.Logger


class EzZendeskUnifiedSdkModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('EzZendeskUnifiedSdk')` in JavaScript.
    Name("EzZendeskUnifiedSdk")

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    AsyncFunction("init") { subdomainUrl: String, applicationId: String, oauthClientId: String ->
      
      if (listOf(subdomainUrl, applicationId, oauthClientId).any { credential -> credential.isEmpty() }) {
        return@AsyncFunction false
      }

      // Enable logging
      Logger.setLoggable(true);
      
      /**
        * Initialize the SDK with your Zendesk subdomain, mobile SDK app ID, and client ID.
        *
        * Get these details from your Zendesk dashboard: Admin -> Channels -> MobileSDK.
        */
      Zendesk.INSTANCE.init(
              appContext.activityProvider?.currentActivity as Context,
              subdomainUrl,
              applicationId,
              oauthClientId
      )

      /**
         * Set an identity (authentication).
         *
         * Talk SDK supports only Anonymous identity
         */
      Zendesk.INSTANCE.setIdentity(
        AnonymousIdentity.Builder()
          .withNameIdentifier("End User")
          .withEmailIdentifier("end.user@domain.com")
          .build()
      )

      Support.INSTANCE.init(Zendesk.INSTANCE);
      AnswerBot.INSTANCE.init(Zendesk.INSTANCE, Support.INSTANCE);
      return@AsyncFunction true
    }

    AsyncFunction("show") {
      MessagingActivity.builder()
      .withEngines(AnswerBotEngine.engine(), ChatEngine.engine(), SupportEngine.engine())
        .show(appContext.activityProvider?.currentActivity as Context);
    }

    AsyncFunction("setIdentity") { name: String, email: String ->
      /**
        * Set an identity (authentication).
        *
        * Talk SDK supports only Anonymous identity
        */
      Zendesk.INSTANCE.setIdentity(
        AnonymousIdentity.Builder()
          .withNameIdentifier(name)
          .withEmailIdentifier(email)
          .build()
      )
    }
  }
}
