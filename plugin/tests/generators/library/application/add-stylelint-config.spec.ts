import { Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import addStylelintConfig from '../../../../src/generators/library/application/add-stylelint-config.use-case';
import { NormalizedSchema } from '../../../../src/generators/library/domain/normalized-schema';

jest.mock('@nx/devkit', () => ({
    ...jest.requireActual('@nx/devkit'),
    writeJson: jest.fn(),
}));

describe('addStylelintConfig', () => {
    let appTree: Tree;
    const options: NormalizedSchema = { name: 'test', directory: 'my-library' };

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should write the Stylelint configuration file with the correct data', () => {
        addStylelintConfig(appTree, options);

        expect(writeJson).toHaveBeenCalledWith(
            appTree,
            'libs/my-library/.stylelintrc.json',
            {
                extends: ['../../.stylelintrc.json'],
                ignoreFiles: ['!**/*'],
                overrides: [
                    {
                        files: ['**/*.scss'],
                        rules: {},
                    },
                ],
            },
        );
    });
});
