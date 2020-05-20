import darkVars from '../themes/dark.json';
import compactVars from '../themes/compact.json';
import defaultVars from '../themes/default.json';

const getThemeColorVars = (theme: string) => {
  if (theme) {
    switch (theme) {
      case 'LIGHT': {
        return compactVars;
      }
      case 'PINK': {
        return {
          ...defaultVars,
          '@primary-color': '#f5aac9',
          '@layout-header-background': '#fffffe'
        };
      }
      case 'DARK': {
        return {
          ...darkVars,
          '@primary-color': '#696969'
        };
      }
    }
  }
};

export default getThemeColorVars;
