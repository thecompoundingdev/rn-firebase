import { Mapping, Theme } from '../../services/theme.service';

export class ThemesService {
  static createThemeListItems = (themes, mapping) => {
    return Object.keys(themes[mapping])
      .filter(key => key !== 'brand')
      .map(theme =>
        ThemesService.createThemeForMapping(themes, mapping, theme)
      );
  };

  static createThemeForMapping = (themes, mapping, theme) => {
    return {
      mapping: mapping,
      name: theme,
      theme: themes[mapping][theme],
    };
  };
}
