const {
  withAndroidManifest,
  withMainActivity,
} = require("@expo/config-plugins");

module.exports = function withPipBackHandler(config) {

  // ---------- Enable PiP ----------
  config = withAndroidManifest(config, config => {
    const activity =
      config.modResults.manifest.application[0].activity.find(
        a => a.$["android:name"] === ".MainActivity"
      );

    activity.$["android:supportsPictureInPicture"] = "true";
    activity.$["android:resizeableActivity"] = "true";

    return config;
  });

  // ---------- Modify MainActivity.kt safely ----------
  config = withMainActivity(config, config => {
    let contents = config.modResults.contents;

    // add import once
    if (!contents.includes("android.app.PictureInPictureParams")) {
      contents = contents.replace(
        "import android.os.Bundle",
        `import android.os.Bundle
import android.os.Build
import android.app.PictureInPictureParams`
      );
    }

    // override onBackPressed safely
    if (!contents.includes("onBackPressed")) {
      contents = contents.replace(
        "super.onCreate(null)",
        `super.onCreate(null)

    override fun onBackPressed() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            enterPictureInPictureMode(
                PictureInPictureParams.Builder().build()
            )
        } else {
            super.onBackPressed()
        }
    }`
      );
    }

    config.modResults.contents = contents;
    return config;
  });

  return config;
};