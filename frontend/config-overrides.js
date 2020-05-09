const path = require('path');
const fs = require("fs");
const {
  override,
  fixBabelImports,
  addWebpackPlugin,
  addLessLoader
} = require('customize-cra');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const { getLessVars } = require('antd-theme-generator');

const defaultVars = getLessVars('./node_modules/antd/lib/style/themes/default.less');
const darkVars = { ...getLessVars('./node_modules/antd/lib/style/themes/dark.less'), '@primary-color': defaultVars['@primary-color'] };
const compactVars = { ...getLessVars('./node_modules/antd/lib/style/themes/compact.less'), '@primary-color': defaultVars['@primary-color'] };

fs.writeFileSync('./src/themes/default.json', JSON.stringify(defaultVars));
fs.writeFileSync('./src/themes/dark.json', JSON.stringify(darkVars));
fs.writeFileSync('./src/themes/compact.json', JSON.stringify(compactVars));

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/vars.less'),
  mainLessFile: path.join(__dirname, './src/styles/main.less'),
  themeVariables: Array.from(new Set([
    "@primary-color",
    "@secondary-color",
    "@text-color",
    "@text-color-secondary",
    "@heading-color",
    "@layout-body-background",
    "@btn-primary-bg",
    "@layout-header-background",
    "@border-color-base",
    '@select-item-selected-option-color',
    ...Object.keys(darkVars),
    ...Object.keys(compactVars)
  ])),
  generateOnce: false,
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
