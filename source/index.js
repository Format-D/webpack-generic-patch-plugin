/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["validatePaths"] }] */
const fs = require('fs');

class GenericPatchPlugin {
  constructor(source, patchSource) {
    this.validatePaths(source, patchSource);
    const basePath = process.cwd();
    this.sourceAbs = source;
    this.source = source.replace(basePath, '');
    this.patchSource = patchSource.replace(basePath, '');
  }

  validatePaths(source, patchSource) {
    if (!source) {
      throw Error('source parameter is required');
    }

    if (!patchSource) {
      throw Error('patchSource parameter is required');
    }

    if (!fs.existsSync(source)) {
      throw Error('source path is not existing');
    }

    if (!fs.existsSync(patchSource)) {
      throw Error('patchSource path is not existing');
    }
  }

  isResultContextSource(result) {
    return result.context.startsWith(this.sourceAbs);
  }

  replaceBeforeResolve(result) {
    if (!result) return;

    const patchFilePath = result.request.replace(this.source, this.patchSource);

    if (fs.existsSync(patchFilePath)) {
      result.request = patchFilePath;
    }

    return result;
  }

  replaceAfterResolve(result) {
    if (!result) return;

    const patchFilePath = result.resource.replace(this.source, this.patchSource);

    if (this.isResultContextSource(result) && fs.existsSync(patchFilePath)) {
      result.resource = patchFilePath;
    }

    return result;
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('GenericPatchPlugin', nmf => {
      nmf.hooks.beforeResolve.tap('GenericPatchPlugin', this.replaceBeforeResolve.bind(this));
      nmf.hooks.afterResolve.tap('GenericPatchPlugin', this.replaceAfterResolve.bind(this));
    });
  }
}

module.exports = GenericPatchPlugin;
