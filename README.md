# Generic patch plugin

This plugin allows you to overwrite modules and assets from a source folder with files from a patch folder in a generic way.  
It may be useful for patching third party code or even to build white-label apps which are based on a common core but add/change behavior through their custom patches.

## Usage

To install it as a dependency in your project run:
`npm install --save-dev webpack-generic-patch-plugin`

Add the `webpack-generic-patch-plugin` to the list of plugins in your webpack config.

**Note: The order in which the plugins are listed does matter. If you run into issues, try to change their order.**

```js
// webpack.config.js
const path = require('path');

// Modules inside the patchPath will be
// preferred over modules from the sourcePath
// with the same relative path.
const sourcePath = path.resolve(__dirname, 'source');
const patchPath = path.resolve(__dirname, 'patch');

const GenericPatchPlugin = require('webpack-generic-patch-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'source/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [new GenericPatchPlugin(sourcePath, patchPath)]
};
```

## Examples

Basic examples can be found in the `example` folder.
A more complex scenario of a react application can be found [here](https://github.com/dtmzr/poke-app).
