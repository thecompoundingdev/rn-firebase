import { font } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const CommonFunction = {
  Measurement: (CondiosDevice, IosDevice, ADevice) => {
    // eslint-disable-next-line no-nested-ternary
    const value = font.ISIOS
      ? font.CONDITION
        ? CondiosDevice
        : IosDevice
      : ADevice;

    return value;
  },
};
