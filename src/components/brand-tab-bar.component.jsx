import React from 'react';
import { TabBar, ThemeProvider } from '@ui-kitten/components';
import { Theming } from '../services/theme.service';

export const BrandTabBar = props => {
  const brandTheme = Theming.useTheme('brand');

  return (
    <ThemeProvider theme={brandTheme}>
      <TabBar {...props} />
    </ThemeProvider>
  );
};
