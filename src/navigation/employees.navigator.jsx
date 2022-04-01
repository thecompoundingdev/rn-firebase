import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { EmployeeDetails, EmployeeList } from '../scenes/employees';
import { screens } from '../app/app-screens';

const Stack = createStackNavigator();

export const EmployeesNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={screens.EmployeeList} component={EmployeeList} />
    <Stack.Screen name={screens.EmployeeDetails} component={EmployeeDetails} />
  </Stack.Navigator>
);
