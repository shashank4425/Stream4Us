const { withMainActivity } = require('@expo/config-plugins');

module.exports = function withImmersiveMode(config) {
  return withMainActivity(config, (config) => {
    let contents = config.modResults.contents;

    // Add required imports if not present
    if (!contents.includes('android.view.WindowInsetsController')) {
      contents = contents.replace(
        'import android.os.Bundle;',
        `import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.os.Build;`
      );
    }

    // Inject immersive mode inside onCreate
    if (!contents.includes('enableImmersiveMode')) {
      contents = contents.replace(
        'super.onCreate(null);',
        `super.onCreate(null);
        enableImmersiveMode();`
      );

      contents = contents.replace(
        'public class MainActivity extends ReactActivity {',
        `public class MainActivity extends ReactActivity {

    private void enableImmersiveMode() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
            }
        } else {
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
            );
        }
    }
`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};