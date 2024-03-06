import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import generator from '../../../src/generators/library/generator';
import { Schema } from '../../../src/generators/library/schema';

jest.mock('../../../src/generators/library/application/add-dependencies.use-case', () => ({
    ...jest.requireActual('../../../src/generators/library/application/add-dependencies.use-case'),
    addDependencies: jest.fn(),
}));

jest.mock('../../../src/generators/library/application/add-stylelint-config.use-case', () => ({
    ...jest.requireActual('../../../src/generators/library/application/add-stylelint-config.use-case'),
    addStylelintConfig: jest.fn(),
}));

jest.mock('../../../src/generators/library/application/add-stylelint-root-config.use-case', () => ({
    ...jest.requireActual('../../../src/generators/library/application/add-stylelint-root-config.use-case'),
    addStylelintRootConfig: jest.fn(),
}));

jest.mock('../../../src/generators/library/application/create-files.use-case', () => ({
    ...jest.requireActual('../../../src/generators/library/application/create-files.use-case'),
    createFiles: jest.fn(),
}));

jest.mock('../../../src/generators/library/application/create-project-configuration.use-case', () => ({
    ...jest.requireActual('../../../src/generators/library/application/create-project-configuration.use-case'),
    createProjectConfiguration: jest.fn(),
}));

jest.mock('../../../src/generators/library/application/normalize-options.use-case', () => ({
    ...jest.requireActual('../../../src/generators/library/application/normalize-options.use-case'),
    normalizeOptions: jest.fn(),
}));

jest.mock('../../../src/generators/library/application/set-generator-defaults.use-case', () => ({
    ...jest.requireActual('../../../src/generators/library/application/set-generator-defaults.use-case'),
    setGeneratorDefaults: jest.fn(),
}));

describe('NxSass generator', () => {
    let appTree: Tree;
    const options: Schema = { name: 'test', directory: 'my-library' };

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should run successfully', async () => {
        await generator(appTree, options);
    });
});
