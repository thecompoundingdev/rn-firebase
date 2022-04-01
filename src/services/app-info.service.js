import { Platform } from 'react-native';
import Constants from 'expo-constants';

export class AppInfoService {
  static getVersion = () => {
    return Constants.manifest.version;
  };

  static getBuildNumber = () => {
    return Platform.select({
      ios: Constants.manifest.ios.buildNumber,
      android: Constants.manifest.android.versionCode,
      web: '',
    });
  };
}
