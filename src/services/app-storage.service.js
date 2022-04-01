import AsyncStorage from '@react-native-async-storage/async-storage';

const MAPPING_KEY = 'mapping';
const THEME_KEY = 'theme';

export class AppStorage {
  static getMapping = fallback => {
    return AsyncStorage.getItem(MAPPING_KEY).then(mapping => {
      return mapping || fallback;
    });
  };

  static getTheme = fallback => {
    return AsyncStorage.getItem(THEME_KEY).then(theme => {
      return theme || fallback;
    });
  };

  static setMapping = mapping => {
    return AsyncStorage.setItem(MAPPING_KEY, mapping);
  };

  static setTheme = theme => {
    return AsyncStorage.setItem(THEME_KEY, theme);
  };
}
