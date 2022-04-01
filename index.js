import { AppRegistry, Platform } from 'react-native';
import App from './src/app/app.component';
import appConfig from './app.config';

const { name: appName } = appConfig.expo;

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent('main', () => App);

if (Platform.OS === 'web') {
  const rootTag =
    document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('KittenTricks', { rootTag });
}
