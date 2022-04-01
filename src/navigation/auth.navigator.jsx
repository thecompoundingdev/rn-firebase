import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { DOMAIN_URI_PREFIX } from '@env';

import { screens } from '../app/app-screens';
import { Login, Signup, ForgotPassword, Reset } from '../scenes/auth';

const Stack = createStackNavigator();

export const AuthNavigator = ({ navigation }) => {
  const initialUrl = Linking.useURL();

  const handleLinks = e => {
    if (e.url) {
      if (e.url.startsWith(DOMAIN_URI_PREFIX)) {
        const params = { url: e.url };
        navigation.navigate(screens.Reset, { params });
      }
    }
  };

  useEffect(() => {
    handleLinks({ url: initialUrl });
  }, [initialUrl]);

  useEffect(() => {
    Linking.addEventListener('url', handleLinks);

    Linking.getInitialURL()
      .then(value => handleLinks({ url: value }))
      .catch(() => {});

    // unsubscribe auth listener on unmount
    return () => {
      Linking.removeEventListener('url', handleLinks);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={screens.Login}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={screens.Login} component={Login} />
      <Stack.Screen name={screens.SignUp} component={Signup} />
      <Stack.Screen name={screens.ForgotPassword} component={ForgotPassword} />
      <Stack.Screen name={screens.Reset} component={Reset} />
    </Stack.Navigator>
  );
};
