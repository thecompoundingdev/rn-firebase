import React from 'react';
import { ListRenderItemInfo, StyleSheet } from 'react-native';
import {
  Divider,
  List,
  ThemeProvider,
  Toggle,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { ThemeCard } from './theme-card.component';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { Theming } from '../../services/theme.service';
import { ThemesService } from './themes.service';
import { appThemes } from '../../app/app-theming';
import { MenuIcon, NotificationIcon } from '../../components/icons';
import { RestartAppModal } from './restart-app-modal.component';

export const ThemesScreen = ({ navigation }) => {
  const mappingContext = React.useContext(Theming.MappingContext);
  const themeContext = React.useContext(Theming.ThemeContext);
  const [evaToggleChecked, setEvaToggleChecked] = React.useState(
    mappingContext.isEva()
  );
  const [restartModalVisible, setRestartModalVisible] = React.useState(false);

  const themes = ThemesService.createThemeListItems(
    appThemes,
    mappingContext.currentMapping
  );

  const onEvaToggleCheckedChange = checked => {
    setEvaToggleChecked(checked);
    setRestartModalVisible(true);
    mappingContext.setCurrentMapping(checked ? 'eva' : 'material');
  };

  const onItemPress = info => {
    themeContext.setCurrentTheme(info.item.name);
  };

  const isActiveTheme = theme => {
    return (
      mappingContext.currentMapping === theme.mapping &&
      themeContext.currentTheme === theme.name
    );
  };

  const shouldDisableItem = theme => {
    return themeContext.currentTheme === theme.name;
  };

  const createThemeNameForItem = theme => {
    return `${theme.mapping} ${theme.name}`.toUpperCase();
  };

  const toggleRestartModal = () => {
    setRestartModalVisible(!restartModalVisible);
  };

  const renderDrawerAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={navigation.toggleDrawer} />
  );

  const renderNotificationAction = () => (
    <TopNavigationAction icon={NotificationIcon} />
  );

  const renderItem = info => (
    <ThemeProvider theme={info.item.theme}>
      <ThemeCard
        style={styles.item}
        title={createThemeNameForItem(info.item)}
        isActive={isActiveTheme(info.item)}
        disabled={shouldDisableItem(info.item)}
        onPress={() => onItemPress(info)}
      />
    </ThemeProvider>
  );

  const renderFooter = () => (
    <Toggle
      style={styles.evaToggle}
      checked={evaToggleChecked}
      onChange={onEvaToggleCheckedChange}
    >
      Eva Design System
    </Toggle>
  );

  return (
    <SafeAreaLayout style={styles.safeArea} insets="top">
      <TopNavigation
        title="Addressbook"
        accessoryLeft={renderDrawerAction}
        accessoryRight={renderNotificationAction}
      />
      <Divider />
      <List
        contentContainerStyle={styles.container}
        data={themes}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />
      <RestartAppModal
        visible={restartModalVisible}
        onBackdropPress={toggleRestartModal}
        onGotItButtonPress={toggleRestartModal}
      />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 8,
  },
  item: {
    margin: 8,
  },
  evaToggle: {
    margin: 8,
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
});
