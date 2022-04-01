import React from 'react';
import { LogBox, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { EmployeesNavigator } from './employees.navigator';
import { CustomersNavigator } from './customers.navigator';
import { PoolsNavigator } from './pool.navigator';
import { JobsNavigator } from './jobs.navigator';
import { MaintenanceNavigator } from './maintenance.navigator';

import { HomeBottomNavigation } from '../scenes/home/home-bottom-navigation.component';
import { HomeDrawer } from '../scenes/home/home-drawer.component';

import { useUser } from '../services/auth-service';

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/*
 * When dev is true in .expo/settings.json (started via `start:dev`),
 * open Components tab as default.
 */
const initialTabRoute = __DEV__ ? 'Components' : 'Layouts';

const ROOT_ROUTES = ['Home', 'Layouts', 'Components', 'Themes', 'Contacts'];

const TabBarVisibilityOptions = ({ route }) => {
  const isNestedRoute = route.state?.index > 0;
  const isRootRoute = ROOT_ROUTES.includes(route.name);

  return {
    // tabBarVisible: isRootRoute && !isNestedRoute
    tabBarVisible: true,
    headerShown: false,
  };
};

const HomeTabsNavigator = () => {
  const { currentUser } = useUser();
  const { isCustomer, isAdmin, isManager, isEmployee } = currentUser;

  return (
    <BottomTab.Navigator
      screenOptions={TabBarVisibilityOptions}
      // initialRouteName={initialTabRoute}
      tabBar={props => <HomeBottomNavigation {...props} />}
    >
      {(isManager || isAdmin) && (
        <>
          <BottomTab.Screen name="Customers" component={CustomersNavigator} />
          <BottomTab.Screen name="Employees" component={EmployeesNavigator} />
          <BottomTab.Screen name="Pools" component={PoolsNavigator} />
        </>
      )}

      {isCustomer && (
        <>
          <BottomTab.Screen name="Pools" component={PoolsNavigator} />
          <BottomTab.Screen
            name="Maintenance"
            component={MaintenanceNavigator}
          />
        </>
      )}

      {isEmployee && (
        <>
          <BottomTab.Screen name="Jobs" component={JobsNavigator} />
        </>
      )}
    </BottomTab.Navigator>
  );
};

export const HomeNavigator = () => (
  <Drawer.Navigator
    screenOptions={{ gestureEnabled: true, headerShown: false }}
    drawerContent={props => <HomeDrawer {...props} />}
  >
    <Drawer.Screen name="Home" component={HomeTabsNavigator} />
  </Drawer.Navigator>
);

LogBox.ignoreLogs(["Accessing the 'state'"]);
