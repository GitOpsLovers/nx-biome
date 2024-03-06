import { Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import addStylelintRootConfig from '../../../../src/generators/library/application/add-stylelint-root-config.use-case';

jest.mock('@nx/devkit', () => ({
    ...jest.requireActual('@nx/devkit'),
    writeJson: jest.fn(),
}));

describe('addStylelintRootConfig', () => {
    let appTree: Tree;

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should write the Stylelint root configuration file with the correct data', () => {
        addStylelintRootConfig(appTree);

        expect(writeJson).toHaveBeenCalledWith(
            appTree,
            '.stylelintrc.json',
            {
                ignoreFiles: ['**/*'],
                overrides: [
                    {
                        files: ['**/*.scss'],
                        extends: ['stylelint-config-standard-scss'],
                        rules: {},
                    },
                ],
                rules: {},
            },
        );
    });
});
