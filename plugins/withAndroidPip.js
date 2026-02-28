const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidPip(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    const application = manifest.manifest.application[0];
    const mainActivity = application.activity.find(
      (activity) => activity.$['android:name'] === '.MainActivity'
    );

    if (mainActivity) {
      mainActivity.$['android:supportsPictureInPicture'] = 'true';
      mainActivity.$['android:resizeableActivity'] = 'true';
      mainActivity.$['android:configChanges'] =
        'keyboard|keyboardHidden|orientation|screenSize|smallestScreenSize|screenLayout|uiMode';
    }

    return config;
  });
};