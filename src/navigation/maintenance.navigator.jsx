import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MaintenanceDetails, ManitenanceList } from '../scenes/maintenance';
import { screens } from '../app/app-screens';

const Stack = createStackNavigator();

export const MaintenanceNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={screens.MaintenanceList} component={ManitenanceList} />
    <Stack.Screen
      name={screens.MaintenanceDetails}
      component={MaintenanceDetails}
    />
  </Stack.Navigator>
);
