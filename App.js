import { AppRegistry, Platform } from 'react-native';
import appConfig from './app.config';
import App from './src/app/app.component';
import './i18n';

const { name: appName } = appConfig.expo;

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root');
  AppRegistry.runApplication(appName, { rootTag });
}

export default App;
