const path = require('path');
// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');

const sourcePath = path.resolve(__dirname, 'source');
const patchPath = path.resolve(__dirname, 'patch');

const GenericPatchPlugin = require('../source/index');

module.exports = {
  mode: 'development',
  entry: {
    first: path.resolve(__dirname, 'source/1-case/index.js'),
    second: path.resolve(__dirname, 'source/2-case/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [new GenericPatchPlugin(sourcePath, patchPath)]
};
