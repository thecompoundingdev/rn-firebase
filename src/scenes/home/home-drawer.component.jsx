import React, { ReactElement, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Divider,
  Drawer,
  DrawerItem,
  DrawerElement,
  Layout,
  Text,
  IndexPath,
} from '@ui-kitten/components';
import { signOut } from 'firebase/auth';

import {
  BookIcon,
  GithubIcon,
  LogoutIcon,
  MoonIcon,
} from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { WebBrowserService } from '../../services/web-browser.service';
import { AppInfoService } from '../../services/app-info.service';
import { useUser } from '../../services/auth-service';
import {
  MappingContextValue,
  ThemeContextValue,
  Theming,
} from '../../services/theme.service';
import { ThemesService } from '../themes/themes.service';
import { appThemes } from '../../app/app-theming';
import { auth } from '../../services/firebase-service';

const version = AppInfoService.getVersion();

export const HomeDrawer = ({ navigation }) => {
  const { currentUser } = useUser();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mappingContext = React.useContext(Theming.MappingContext);
  const themeContext = React.useContext(Theming.ThemeContext);

  const themes = ThemesService.createThemeListItems(
    appThemes,
    mappingContext.currentMapping
  );

  const themeNames = useMemo(() => themes.map(theme => theme.name), [themes]);

  const toggleTheme = () => {
    const [newTheme] = themeNames.filter(
      theme => theme !== themeContext.currentTheme
    );
    themeContext.setCurrentTheme(newTheme);
  };

  const handleLogout = () => {
    signOut(auth).catch(error => console.error('Error logging out: ', error));
  };

  const DATA = [
    // {
    //   title: 'Libraries',
    //   icon: GithubIcon,
    //   onPress: () => {
    //     navigation.toggleDrawer();
    //     navigation.navigate('Libraries');
    //   },
    // },
    {
      title: 'Documentation',
      icon: BookIcon,
      onPress: () => {
        WebBrowserService.openBrowserAsync(
          'https://akveo.github.io/react-native-ui-kitten'
        );
        // navigation.toggleDrawer();
      },
    },
    {
      title: 'Toggle Theme',
      icon: MoonIcon,
      onPress: () => {
        toggleTheme();
        // navigation.toggleDrawer();
      },
    },
  ];

  const renderHeader = () => (
    <SafeAreaLayout insets="top" level="2">
      <Layout style={styles.header} level="2">
        <View style={styles.profileContainer}>
          <Avatar
            size="giant"
            source={require('../../assets/images/image-app-icon.png')}
          />
          <Text style={styles.profileName} category="h6">
            {currentUser.firstName
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : 'User'}
          </Text>
        </View>
      </Layout>
    </SafeAreaLayout>
  );

  const renderFooter = () => (
    <SafeAreaLayout insets="bottom">
      <React.Fragment>
        <Divider />
        <DrawerItem
          title="Logout"
          onPress={() => {
            // navigation.toggleDrawer();
            handleLogout();
          }}
          accessoryLeft={LogoutIcon}
        />
        <Divider />
        <View style={styles.footer}>
          <Text style={styles.appVersion}>{`Version ${version}`}</Text>
        </View>
      </React.Fragment>
    </SafeAreaLayout>
  );

  return (
    <Drawer
      header={renderHeader}
      footer={renderFooter}
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}
    >
      {DATA.map((el, index) => (
        <DrawerItem
          key={index}
          title={el.title}
          onPress={el.onPress}
          accessoryLeft={el.icon}
        />
      ))}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 16,
    paddingVertical: 10,
  },
  appVersion: {
    fontSize: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    marginHorizontal: 16,
  },
});
