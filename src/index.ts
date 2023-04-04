import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to EzZendeskUnifiedSdk.web.ts
// and on native platforms to EzZendeskUnifiedSdk.ts
import {
  ChangeEventPayload,
  EzZendeskUnifiedSdkViewProps,
} from "./EzZendeskUnifiedSdk.types";
import EzZendeskUnifiedSdkModule from "./EzZendeskUnifiedSdkModule";

export async function init(
  subdomainUrl: string,
  applicationId: string,
  oauthClientId: string
) {
  return await EzZendeskUnifiedSdkModule.init(
    subdomainUrl,
    applicationId,
    oauthClientId
  );
}

export async function show() {
  return await EzZendeskUnifiedSdkModule.show();
}

export async function setIdentity(name: string, email: string) {
  return await EzZendeskUnifiedSdkModule.setIdentity(name, email);
}

const emitter = new EventEmitter(
  EzZendeskUnifiedSdkModule ?? NativeModulesProxy.EzZendeskUnifiedSdk
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export { EzZendeskUnifiedSdkViewProps, ChangeEventPayload };
