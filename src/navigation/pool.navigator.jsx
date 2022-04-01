import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AllPools, MyPools, PoolDetails } from '../scenes/pools';
import { screens } from '../app/app-screens';
import { useUser } from '../services/auth-service';

const Stack = createStackNavigator();

export const PoolsNavigator = () => {
  const { currentUser } = useUser();
  const { isAdmin, isManager, isCustomer } = currentUser;

  if (isCustomer) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={screens.PoolsList} component={MyPools} />
        <Stack.Screen name={screens.PoolDetails} component={PoolDetails} />
      </Stack.Navigator>
    );
  }

  if (isAdmin || isManager) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={screens.PoolsList} component={AllPools} />
        <Stack.Screen name={screens.PoolDetails} component={PoolDetails} />
      </Stack.Navigator>
    );
  }

  return null;
};
