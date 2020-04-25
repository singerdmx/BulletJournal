const getThemeColorVars = (theme: string) => {
  if (theme) {
    switch (theme) {
      case 'LIGHT': {
        break;
      }
      case 'PINK': {
        return {
          '@primary-color': '#f5aac9',
        };
      }
      case 'DARK': {
        return {
          '@primary-color': '#428bca',
          '@layout-header-background': '#001529'
        };
      }
    }
  }
};

export default getThemeColorVars;
