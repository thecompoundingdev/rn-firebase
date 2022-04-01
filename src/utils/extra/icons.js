import React from 'react';
import { Icon, useTheme } from '@ui-kitten/components';

export const DoneAllIcon = style => {
  const theme = useTheme();

  return (
    <Icon
      {...style}
      width={16}
      height={16}
      fill={theme['color-primary-default']}
      name="done-all"
    />
  );
};

export const ArrowIosBackIcon = style => (
  <Icon {...style} name="arrow-ios-back" />
);
export const EmailIcon = style => <Icon {...style} name="email" />;
export const FacebookIcon = style => <Icon {...style} name="facebook" />;
export const GoogleIcon = style => <Icon {...style} name="google" />;
export const PersonIcon = style => <Icon {...style} name="person" />;
export const PlusIcon = style => <Icon {...style} name="plus" />;
export const SearchIcon = style => <Icon {...style} name="search" />;
export const TwitterIcon = style => <Icon {...style} name="twitter" />;
