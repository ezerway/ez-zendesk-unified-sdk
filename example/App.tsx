import * as EzZendeskUnifiedSdk from "ez-zendesk-unified-sdk";
import { useEffect, useState } from "react";
import { StyleSheet, View, Button } from "react-native";

const SUBDOMAIN_URL = "https://d3v-ezerway.zendesk.com";
const APPLICATION_ID = "b07da09210d388fabdc556fec73e8834e890263468e360a0";
const OAUTH_CLIENT_ID = "mobile_sdk_client_f4dbec14128019d93118";

export default function App() {
  const [expoZendeskUnified, setExpoZendeskUnified] = useState(false);

  useEffect(() => {
    (async () => {
      const expoZendeskUnified = await EzZendeskUnifiedSdk.init(
        SUBDOMAIN_URL,
        APPLICATION_ID,
        OAUTH_CLIENT_ID
      );
      setExpoZendeskUnified(expoZendeskUnified);
    })();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Button
        disabled={!expoZendeskUnified}
        onPress={() => EzZendeskUnifiedSdk.show()}
        title="Need support"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
