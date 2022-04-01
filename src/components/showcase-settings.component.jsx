import React, { ReactElement } from 'react';
import { I18nManager, Platform, StyleSheet, ViewProps } from 'react-native';
import {
  Button,
  ButtonElement,
  CheckBox,
  IndexPath,
  Layout,
  OverflowMenu,
  MenuItem,
} from '@ui-kitten/components';
import { ColorPaletteIcon, SettingsIcon, TrashIcon } from './icons';
import { ComponentShowcaseSetting } from '../model/showcase.model';
import { Theme } from '../services/theme.service';
import { AppReloadService } from '../services/app-reload.service';

export const ShowcaseSettings = props => {
  const [themesMenuVisible, setThemesMenuVisible] = React.useState(false);
  const [settingsMenuVisible, setSettingsMenuVisible] = React.useState(false);

  const createSettingMenuItem = (setting, index) => (
    <MenuItem
      key={index}
      title={setting.description || `${setting.propertyName}: ${setting.value}`}
    />
  );

  const createThemeMenuItem = (title, index) => (
    <MenuItem key={index} title={title} />
  );

  const onThemeSelect = index => {
    props.onThemeSelect(props.themes[index.row]);
    setThemesMenuVisible(false);
  };

  const onResetButtonPress = () => {
    props.onReset();
  };

  const onSettingSelect = index => {
    const { [index.row]: setting } = props.settings;

    props.onSettingSelect({
      [setting.propertyName]: setting.value,
    });

    setSettingsMenuVisible(false);
  };

  const createThemesMenuItems = () => {
    return props.themes && props.themes.map(createThemeMenuItem);
  };

  const createSettingsMenuItems = () => {
    const settings =
      props.settings && props.settings.map(createSettingMenuItem);
    return settings || [];
  };

  const toggleThemesMenu = () => {
    setThemesMenuVisible(!themesMenuVisible);
  };

  const toggleSettingsMenu = () => {
    setSettingsMenuVisible(!settingsMenuVisible);
  };

  const toggleRtl = () => {
    I18nManager.forceRTL(!I18nManager.isRTL);
    I18nManager.allowRTL(I18nManager.isRTL);
    Platform.OS !== 'web' && AppReloadService.reload();
  };

  const renderRTLToggle = () => (
    <CheckBox checked={I18nManager.isRTL} onChange={toggleRtl}>
      RTL
    </CheckBox>
  );

  const renderButtonThemes = () => (
    <Button
      size="tiny"
      accessoryLeft={ColorPaletteIcon}
      disabled={!props.themes}
      onPress={toggleThemesMenu}
    >
      THEMES
    </Button>
  );

  const renderButtonSettings = () => (
    <Button
      size="tiny"
      accessoryLeft={SettingsIcon}
      disabled={!props.settings}
      onPress={toggleSettingsMenu}
    >
      SETTINGS
    </Button>
  );

  return (
    <Layout style={styles.container} level="1">
      <OverflowMenu
        visible={themesMenuVisible}
        onSelect={onThemeSelect}
        onBackdropPress={toggleThemesMenu}
        anchor={renderButtonThemes}
      >
        {createThemesMenuItems()}
      </OverflowMenu>
      <OverflowMenu
        visible={settingsMenuVisible}
        onSelect={onSettingSelect}
        onBackdropPress={toggleSettingsMenu}
        anchor={renderButtonSettings}
      >
        {createSettingsMenuItems()}
      </OverflowMenu>
      <Button
        size="tiny"
        status="danger"
        accessoryLeft={TrashIcon}
        disabled={!props.settings}
        onPress={onResetButtonPress}
      >
        RESET
      </Button>
      {__DEV__ && renderRTLToggle()}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 16,
  },
});
