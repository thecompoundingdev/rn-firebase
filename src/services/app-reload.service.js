import { Updates } from 'expo';

export class AppReloadService {
  static reload = () => {
    Updates.reload();
  };
}
