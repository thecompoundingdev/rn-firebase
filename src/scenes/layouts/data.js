import React from 'react';
import { ImageStyle } from 'react-native';
import { ThemedIcon } from '../../components/themed-icon.component';
import {
  AssetArticlesDarkIcon,
  AssetArticlesIcon,
  AssetAuthDarkIcon,
  AssetAuthIcon,
  AssetDashboardsDarkIcon,
  AssetDashboardsIcon,
  AssetEcommerceDarkIcon,
  AssetEcommerceIcon,
  AssetMessagingDarkIcon,
  AssetMessagingIcon,
  AssetSocialDarkIcon,
  AssetSocialIcon,
} from '../../components/icons';
// import { MenuItem } from '../../model/menu-item.model';

export const data = [
  {
    title: 'Auth',
    route: 'Auth',
    icon: style => {
      return React.createElement(ThemedIcon, {
        ...style,
        light: AssetAuthIcon,
        dark: AssetAuthDarkIcon,
      });
    },
  },
  {
    title: 'Social',
    route: 'Social',
    icon: style => {
      return React.createElement(ThemedIcon, {
        ...style,
        light: AssetSocialIcon,
        dark: AssetSocialDarkIcon,
      });
    },
  },
  {
    title: 'Articles',
    route: 'Articles',
    icon: style => {
      return React.createElement(ThemedIcon, {
        ...style,
        light: AssetArticlesIcon,
        dark: AssetArticlesDarkIcon,
      });
    },
  },
  {
    title: 'Messaging',
    route: 'Messaging',
    icon: style => {
      return React.createElement(ThemedIcon, {
        ...style,
        light: AssetMessagingIcon,
        dark: AssetMessagingDarkIcon,
      });
    },
  },
  {
    title: 'Dashboards',
    route: 'Dashboards',
    icon: style => {
      return React.createElement(ThemedIcon, {
        ...style,
        light: AssetDashboardsIcon,
        dark: AssetDashboardsDarkIcon,
      });
    },
  },
  {
    title: 'Ecommerce',
    route: 'Ecommerce',
    icon: style => {
      return React.createElement(ThemedIcon, {
        ...style,
        light: AssetEcommerceIcon,
        dark: AssetEcommerceDarkIcon,
      });
    },
  },
];
