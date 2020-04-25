const getThemeColorVars = (theme: string) => {
  if (theme) {
    switch (theme) {
      case 'LIGHT': {
        return { '@layout-header-background': '#fffffe' };
      }
      case 'PINK': {
        return {
          '@primary-color': '#f5aac9',
          '@layout-header-background': '#fffffe'
        };
      }
      case 'DARK': {
        return {
          '@primary-color': '#428bca',
          '@layout-header-background': '#000002'
        };
      }
    }
  }
};

export default getThemeColorVars;
