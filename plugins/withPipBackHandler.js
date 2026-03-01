const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withPip(config) {
  return withAndroidManifest(config, config => {
    const activity =
      config.modResults.manifest.application[0].activity.find(
        a => a.$["android:name"] === ".MainActivity"
      );

    activity.$["android:supportsPictureInPicture"] = "true";
    activity.$["android:resizeableActivity"] = "true";
    activity.$["android:launchMode"] = "singleTask";

    return config;
  });
};