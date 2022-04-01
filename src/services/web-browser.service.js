import * as WebBrowser from 'expo-web-browser';

export class WebBrowserService {
  static openBrowserAsync = url => {
    return WebBrowser.openBrowserAsync(url);
  };
}
