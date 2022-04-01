import React from 'react';
import { ImageStyle } from 'react-native';
import { IconElement, IconProps } from '@ui-kitten/components';
import { ThemeContextValue, Theming } from '../services/theme.service';

export const ThemedIcon = props => {
  const themeContext = React.useContext(Theming.ThemeContext);
  const { light, dark, ...iconProps } = props;

  return themeContext.isDarkMode() ? dark(iconProps) : light(iconProps);
};
