import React from 'react';
import { BottomNavigation, ThemeProvider } from '@ui-kitten/components';
import { Theming } from '../services/theme.service';

export const BrandBottomNavigation = props => {
  const brandTheme = Theming.useTheme('brand');

  return (
    <ThemeProvider theme={brandTheme}>
      <BottomNavigation {...props} />
    </ThemeProvider>
  );
};
