import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Divider,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {
  SafeAreaLayout,
  SafeAreaLayoutProps,
} from './safe-area-layout.component';
import { Showcase } from './showcase.component';
import { ShowcaseSettings } from './showcase-settings.component';
import { Theme, ThemeContextValue, Theming } from '../services/theme.service';
import {
  ComponentShowcase,
  ComponentShowcaseSetting,
} from '../model/showcase.model';
import { ArrowIosBackIcon } from './icons';

const themes = ['light', 'dark'];

export const ShowcaseContainer = props => {
  const {
    showcase,
    settings,
    renderItem,
    children,
    onBackPress,
    ...showcaseProps
  } = props;

  const [showcaseSettings, setShowcaseSettings] = React.useState({});
  const themeContext = React.useContext(Theming.ThemeContext);

  const onSelectSetting = selectedSettings => {
    setShowcaseSettings({ ...settings, ...selectedSettings });
  };

  const onResetSettings = () => {
    setShowcaseSettings({});
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
  );

  return (
    <SafeAreaLayout style={styles.container} insets="top">
      <TopNavigation title={showcase.title} accessoryLeft={renderBackAction} />
      <Divider />
      <ShowcaseSettings
        themes={themes}
        settings={settings}
        onSettingSelect={onSelectSetting}
        onThemeSelect={themeContext.setCurrentTheme}
        onReset={onResetSettings}
      />
      <Divider />
      {children}
      <Showcase
        {...showcaseProps}
        showcase={showcase}
        renderItem={renderItem}
        settings={showcaseSettings}
      />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
