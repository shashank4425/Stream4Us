const {
  withAndroidManifest,
  withMainActivity,
} = require("@expo/config-plugins");

module.exports = function withPipBackHandler(config) {

  // Enable PiP
  config = withAndroidManifest(config, config => {
    const activity =
      config.modResults.manifest.application[0].activity.find(
        a => a.$["android:name"] === ".MainActivity"
      );

    activity.$["android:supportsPictureInPicture"] = "true";
    activity.$["android:resizeableActivity"] = "true";

    return config;
  });

  // Add PiP method into MainActivity
  config = withMainActivity(config, config => {

    if (!config.modResults.contents.includes("enterPipFromRN")) {

      config.modResults.contents =
        config.modResults.contents.replace(
          "class MainActivity",
          `
import android.os.Build;
import android.app.PictureInPictureParams;

class MainActivity`
        );

      config.modResults.contents =
        config.modResults.contents.replace(
          "}",
          `
  public void enterPipFromRN() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      enterPictureInPictureMode(
        new PictureInPictureParams.Builder().build()
      );
    }
  }
}
`
        );
    }

    return config;
  });

  return config;
};