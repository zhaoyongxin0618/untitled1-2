if (process.env.DEV) {
  exports.iosTestApp = "sample-code/apps/TestApp/build/release-iphonesimulator/TestApp.app";
  exports.iosWebviewApp = "sample-code/apps/WebViewApp/build/release-iphonesimulator/WebViewApp.app";
  exports.iosUICatalogApp = "sample-code/apps/UICatalog/build/release-iphonesimulator/UICatalog.app";
  exports.androidApiDemos = "sample-code/apps/ApiDemos/bin/ApiDemos-debug.apk";
  exports.selendroidTestApp = "/usr/local/lib/node_modules/npm/untitled1/public/stylesheets/yzj_7.0.4_release.apk";
} else {
  exports.iosTestApp = "http://appium.github.io/appium/assets/TestApp7.1.app.zip";
  exports.iosWebviewApp = "http://appium.github.io/appium/assets/WebViewApp7.1.app.zip";
  exports.iosUICatalogApp = "http://appium.github.io/appium/assets/UICatalog7.1.app.zip";
  exports.androidApiDemos = "http://appium.github.io/appium/assets/ApiDemos-debug.apk";
  exports.selendroidTestApp = "http://yunzhijia.com/home/download/yzj_7.0.4_release.apk";

  exports.iosWebviewAppLocal = "http://localhost:3000/WebViewApp7.1.app.zip";
  exports.androidApiDemosLocal = "http://localhost:3000/ApiDemos-debug.apk";
}
