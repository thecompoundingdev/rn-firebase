import React from 'react';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomNavigationTab,
  Divider,
  StyleService,
} from '@ui-kitten/components';

import { BrandBottomNavigation } from '../../components/brand-bottom-navigation.component';
import {
  FileTextIcon,
  StarOutlineIcon,
  PeopleIcon,
} from '../../components/icons';
import { useUser } from '../../services/auth-service';

const useVisibilityAnimation = visible => {
  const animation = React.useRef(new Animated.Value(visible ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animation.current, {
      duration: 200,
      toValue: visible ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  return {
    transform: [
      {
        // @ts-ignore
        translateY: animation.current.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
    position: visible ? null : 'absolute',
  };
};

const BottomNavigationTabItem = ({ show, ...props }) =>
  show ? <BottomNavigationTab {...props} /> : null;

const routeNames = [
  'Customers',
  'Employees',
  'Pools',
  'Pools',
  'Maintenance',
  'Jobs',
];

export const HomeBottomNavigation = ({ navigation, state, descriptors }) => {
  const { currentUser } = useUser();
  const safeAreaInsets = useSafeAreaInsets();

  const focusedRoute = state.routes[state.index];
  const { tabBarVisible } = descriptors[focusedRoute.key].options;

  const transforms = useVisibilityAnimation(tabBarVisible);

  const onSelect = index => {
    navigation.navigate(routeNames[index]);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        transforms,
        { paddingBottom: tabBarVisible ? safeAreaInsets.bottom : 0 },
      ]}
    >
      <Divider />
      <BrandBottomNavigation
        appearance="noIndicator"
        selectedIndex={state.index}
        onSelect={onSelect}
      >
        <BottomNavigationTabItem
          icon={StarOutlineIcon}
          show={currentUser.isAdmin || currentUser.isManager}
          title={routeNames[0]}
        />

        <BottomNavigationTabItem
          icon={PeopleIcon}
          show={currentUser.isAdmin || currentUser.isManager}
          title={routeNames[1]}
        />

        <BottomNavigationTabItem
          icon={StarOutlineIcon}
          show={currentUser.isAdmin || currentUser.isManager}
          title={routeNames[2]}
        />

        <BottomNavigationTabItem
          icon={FileTextIcon}
          show={currentUser.isCustomer}
          title="My Pools"
        />

        <BottomNavigationTabItem
          icon={FileTextIcon}
          show={currentUser.isCustomer}
          title={routeNames[4]}
        />

        <BottomNavigationTabItem
          icon={FileTextIcon}
          show={currentUser.isEmployee}
          title={routeNames[5]}
        />
      </BrandBottomNavigation>
    </Animated.View>
  );
};

const styles = StyleService.create({
  container: {
    left: 0,
    right: 0,
    bottom: 0,
  },
});
