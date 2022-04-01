import { Platform } from 'react-native';
import * as Device from 'expo-device';
let deviceModel = Device.modelName;

const Condtion =
  deviceModel === 'iPhone 8' ||
  deviceModel === 'iPhone 8 Plus' ||
  deviceModel === 'iPhone 7' ||
  deviceModel === 'iPhone 7 Plus' ||
  deviceModel === 'iPhone 6' ||
  deviceModel === 'iPhone 6s' ||
  deviceModel === 'iPhone 6 Plus' ||
  deviceModel === 'iPhone 6s Plus' ||
  deviceModel === 'iPhone 5s' ||
  deviceModel === 'iPhone 5' ||
  deviceModel === 'iPhone 5C' ||
  deviceModel === 'iPhone SE' ||
  deviceModel === 'iPhone SE 2';

const IsIos = Platform.OS === 'ios';

// eslint-disable-next-line import/prefer-default-export
export const font = {
  FONT_WEIGHT_400: '400',
  FONT_WEIGHT_200: '200',
  FONT_WEIGHT_600: '600',
  FONT_WEIGHT_800: '800',

  DEVICE_TYPE: IsIos ? 2 : 3,
  CONDITION: Condtion,
  ISIOS: IsIos,

  FONT_10: 10,
  FONT_12: 12,
  FONT_14: 14,
  FONT_16: 16,
  FONT_18: 18,
  FONT_20: 20,
  FONT_22: 22,
  FONT_25: 25,
};
