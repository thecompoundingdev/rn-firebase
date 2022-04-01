import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomerDetails, CustomerList } from '../scenes/customers';
import { screens } from '../app/app-screens';

const Stack = createStackNavigator();

export const CustomersNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={screens.CustomerList} component={CustomerList} />
    <Stack.Screen name={screens.CustomerDetails} component={CustomerDetails} />
  </Stack.Navigator>
);
