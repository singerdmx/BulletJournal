const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/vars.less'),
  mainLessFile: path.join(__dirname, './src/styles/main.less'),
  themeVariables: ['@primary-color'],
  indexFileName: 'index.html',
  outputFilePath: path.join(__dirname, './public/color.less'),
  customColorRegexArray: [/^darken\(.*\)$/],
};

module.exports = function override(config, env) {
  config = updateConfig(config, env, options);
  return config;
};
