import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { JobDetails, JobsList } from '../scenes/jobs';
import { screens } from '../app/app-screens';

const Stack = createStackNavigator();

export const JobsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={screens.JobsList} component={JobsList} />
    <Stack.Screen name={screens.JobDetails} component={JobDetails} />
  </Stack.Navigator>
);
