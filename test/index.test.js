const fs = require('fs');

jest.unmock('../source/index');
const GenericPatchPlugin = require('../source/index');

const basePath = '/users/user1/projects/a';
const sourcePath = `${basePath}/src/source`;
const patchSourcePath = `${basePath}/src/customer`;
const notExistingPath = `${basePath}/not/existing`;

jest.mock('fs');
process.cwd = jest.fn(() => basePath);

describe('Setting up instance', () => {
  test('Inits paths correctly', () => {
    jest.spyOn(GenericPatchPlugin.prototype, 'validatePaths').mockImplementationOnce(() => true);

    const plugin = new GenericPatchPlugin(sourcePath, patchSourcePath);
    expect(plugin.sourceAbs).toBe(sourcePath);
    expect(plugin.source).toBe('/src/source');
    expect(plugin.patchSource).toBe('/src/customer');
  });

  test('Fails on missing source paramter', () => {
    expect(() => new GenericPatchPlugin(null, patchSourcePath)).toThrow();
  });

  test('Fails on missing patchSource parameter', () => {
    expect(() => new GenericPatchPlugin(sourcePath, null)).toThrow();
  });

  test('Fails on not existing source path', () => {
    fs.existsSync.mockReturnValue(false);

    expect(() => new GenericPatchPlugin(notExistingPath, patchSourcePath)).toThrow();

    fs.existsSync.mockClear();
  });

  test('Fails on not existing patchSource path', () => {
    fs.existsSync.mockReturnValue(false);

    expect(() => new GenericPatchPlugin(sourcePath, notExistingPath)).toThrow();

    fs.existsSync.mockClear();
  });
});

describe('Before resolve tap', () => {
  beforeAll(() => {
    jest.spyOn(GenericPatchPlugin.prototype, 'validatePaths').mockImplementation(() => true);
  });

  test('Return undefined when no result is passed', () => {
    const plugin = new GenericPatchPlugin(sourcePath, patchSourcePath);
    expect(plugin.replaceBeforeResolve()).toBe(undefined);
  });

  test('Update result if patch file exists', () => {
    fs.existsSync.mockReturnValue(true);

    const plugin = new GenericPatchPlugin(sourcePath, patchSourcePath);
    const passedResult = {
      request: `${sourcePath}/file.js`
    };
    expect(plugin.replaceBeforeResolve(passedResult).request).toBe(`${patchSourcePath}/file.js`);

    fs.existsSync.mockClear();
  });

  test('Dont update result if no patch file', () => {
    fs.existsSync.mockReturnValueOnce(false);

    const plugin = new GenericPatchPlugin(sourcePath, patchSourcePath);
    const passedResult = {
      request: `${sourcePath}/file.js`
    };
    expect(plugin.replaceBeforeResolve(passedResult).request).toBe(`${sourcePath}/file.js`);

    fs.existsSync.mockClear();
  });
});

describe('After resolve tap', () => {
  beforeAll(() => {
    jest.spyOn(GenericPatchPlugin.prototype, 'validatePaths').mockImplementation(() => true);
  });

  test('Return undefined when no result is passed', () => {
    fs.existsSync.mockReturnValue(true);

    const plugin = new GenericPatchPlugin(sourcePath, patchSourcePath);
    expect(plugin.replaceAfterResolve()).toBe(undefined);

    fs.existsSync.mockClear();
  });

  test('Update result if patch file exists and context source', () => {
    fs.existsSync.mockReturnValue(true);

    const plugin = new GenericPatchPlugin(sourcePath, patchSourcePath);
    const passedResult = {
      resource: `${sourcePath}/file.js`,
      context: `${sourcePath}`
    };
    expect(plugin.replaceAfterResolve(passedResult).resource).toBe(`${patchSourcePath}/file.js`);

    fs.existsSync.mockClear();
  });

  test('Dont update result if patch file exists and context not source', () => {
    fs.existsSync.mockReturnValue(true);

    const plugin = new GenericPatchPlugin(sourcePath, patchSourcePath);
    const passedResult = {
      resource: `${sourcePath}/file.js`,
      context: `${patchSourcePath}`
    };
    expect(plugin.replaceAfterResolve(passedResult).resource).toBe(`${sourcePath}/file.js`);

    fs.existsSync.mockClear();
  });

  test('Dont update result if no patch file', () => {
    fs.existsSync.mockReturnValueOnce(false);

    GenericPatchPlugin.validatePaths = jest.fn(() => undefined);

    const plugin = new GenericPatchPlugin(sourcePath, patchSourcePath);
    const passedResult = {
      request: `${sourcePath}/file.js`,
      context: `${sourcePath}`
    };
    expect(plugin.replaceBeforeResolve(passedResult).request).toBe(`${sourcePath}/file.js`);

    fs.existsSync.mockClear();
  });
});
