const { withMainActivity } = require('@expo/config-plugins');

module.exports = function withMainActivityPip(config) {
  return withMainActivity(config, (config) => {
    let contents = config.modResults.contents;

    // Add required imports
    if (!contents.includes('android.app.PictureInPictureParams')) {
      contents = contents.replace(
        'import android.os.Bundle;',
        `import android.os.Bundle;
import android.app.PictureInPictureParams;
import android.util.Rational;
import android.os.Build;`
      );
    }

    // Add back press override
    if (!contents.includes('enterPictureInPictureMode')) {
      contents = contents.replace(
        'public class MainActivity extends ReactActivity {',
        `public class MainActivity extends ReactActivity {

  @Override
  public void onBackPressed() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Rational aspectRatio = new Rational(16, 9);
      PictureInPictureParams params =
          new PictureInPictureParams.Builder()
              .setAspectRatio(aspectRatio)
              .build();
      enterPictureInPictureMode(params);
    } else {
      super.onBackPressed();
    }
  }
`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};