import React, { useState, useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import * as Linking from 'expo-linking';
import { onAuthStateChanged } from 'firebase/auth';

import { LoadingIndicator } from '../components';
import { auth } from '../services/firebase-service';
import { useUser } from '../services/auth-service';
import { screens } from '../app/app-screens';
import { AuthNavigator } from './auth.navigator';
import { HomeNavigator } from './home.navigator';

/*
 * Navigation theming: https://reactnavigation.org/docs/en/next/themes.html
 */

const navigatorTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // prevent layout blinking when performing navigation
    background: 'transparent',
  },
};

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      [screens.Reset]: 'reset',
    },
  },
};

export const AppNavigator = () => {
  const { loadStatus, currentUser, setUser } = useUser();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser);
    });

    // unsubscribe auth listener on unmount
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadStatus) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer linking={linking} theme={navigatorTheme}>
      {currentUser ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

LogBox.ignoreLogs([
  'Setting a timer for a long period of time',
  'AsyncStorage has been extracted from react-native core',
]); // Ignore log notification by message
