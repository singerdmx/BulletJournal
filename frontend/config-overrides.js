const path = require('path');
const {
  override,
  fixBabelImports,
  addWebpackPlugin,
  addLessLoader
} = require('customize-cra');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin')

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/vars.less'),
  mainLessFile: path.join(__dirname, './src/styles/main.less'),
  themeVariables: ['@primary-color', '@layout-header-background'],
  indexFileName: false,
  outputFilePath: path.join(__dirname, './public/color.less'),
  lessUrl: "https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js",
  customColorRegexArray: [/^darken\(.*\)$/],
};

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addWebpackPlugin(new AntDesignThemePlugin(options)),
  addLessLoader({
    javascriptEnabled: true,
  })
)
