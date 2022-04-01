// import 'dotenv/config';

export default {
  expo: {
    name: 'Addressbook',
    slug: 'csapps-addressbook',
    scheme: 'addressbook',
    privacy: 'public',
    platforms: ['ios', 'android', 'web'],
    version: '1.0.0',
    orientation: 'portrait',
    description: 'Addressbook',
    icon: './src/assets/images/image-app-icon.png',
    splash: {
      image: 'src/assets/images/image-splash.png',
      resizeMode: 'contain',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: [
      'src/assets/images/*',
      'src/assets/fonts',
      'src/layouts/**/assets/*',
      'src/contact-apps/assets/*',
    ],
    ios: {
      bundleIdentifier: 'com.csapps.addressbook',
      supportsTablet: true,
      associatedDomains: ['applinks:fcmtestfirebase.page.link'],
      // appStoreUrl: '',
      buildNumber: '1',
    },
    android: {
      package: 'com.csapps.addressbook',
      // playStoreUrl: '',
      versionCode: 1,
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'fcmtestfirebase.page.link',
              pathPrefix: '/',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    userInterfaceStyle: 'automatic',
    androidStatusBar: {
      barStyle: 'dark-content',
      backgroundColor: '#F7F9FC',
    },
    entryPoint: 'node_modules/expo/AppEntry.js',
  },
};
