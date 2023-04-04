import {
  withProjectBuildGradle,
  ConfigPlugin,
  createRunOncePlugin,
} from "@expo/config-plugins";
import {
  createGeneratedHeaderComment,
  MergeResults,
  removeGeneratedContents,
} from "@expo/config-plugins/build/utils/generateCode";

const pkg = require("ez-zendesk-unified-sdk/package.json");
// const pkg = { version: '1.0.0', name: 'ez-zendesk-unified-sdk' };


// Because we need the package to be added AFTER the React and Google maven packages, we create a new allprojects.
// It's ok to have multiple allprojects.repositories, so we create a new one since it's cheaper than tokenizing
// the existing block to find the correct place to insert our ZendeskUnified maven.
const gradleMaven = [
  `allprojects { repositories { jcenter() } }`,
  `allprojects { repositories { maven { url 'https://zendesk.jfrog.io/zendesk/repo' } } }`,
].join("\n");

const withAndroidZendeskUnifiedGradle: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addZendeskUnifiedImport(
        config.modResults.contents
      ).contents;
    } else {
      throw new Error(
        "Cannot add ZendeskUnified maven gradle because the build.gradle is not groovy"
      );
    }
    return config;
  });
};

export function addZendeskUnifiedImport(src: string): MergeResults {
  return appendContents({
    tag: "ez-zendesk-unified-sdk-import",
    src,
    newSrc: gradleMaven,
    comment: "//",
  });
}

// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
function appendContents({
  src,
  newSrc,
  tag,
  comment,
}: {
  src: string;
  newSrc: string;
  tag: string;
  comment: string;
}): MergeResults {
  const header = createGeneratedHeaderComment(newSrc, tag, comment);
  if (!src.includes(header)) {
    // Ensure the old generated contents are removed.
    const sanitizedTarget = removeGeneratedContents(src, tag);
    const contentsToAdd = [
      // @something
      header,
      // contents
      newSrc,
      // @end
      `${comment} @generated end ${tag}`,
    ].join("\n");

    return {
      contents: sanitizedTarget ?? src + contentsToAdd,
      didMerge: true,
      didClear: !!sanitizedTarget,
    };
  }
  return { contents: src, didClear: false, didMerge: false };
}

const withZendeskUnified: ConfigPlugin<void> = (config) => {
  return withAndroidZendeskUnifiedGradle(config);
};

export default createRunOncePlugin(withZendeskUnified, pkg.name, pkg.version);
