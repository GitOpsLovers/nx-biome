import { Tree, generateFiles } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import createFiles from '../../../../src/generators/library/application/create-files.use-case';
import { NormalizedSchema } from '../../../../src/generators/library/domain/normalized-schema';

jest.mock('@nx/devkit', () => ({
    ...jest.requireActual('@nx/devkit'),
    generateFiles: jest.fn(),
}));

describe('createFiles', () => {
    let appTree: Tree;
    const options: NormalizedSchema = { name: 'test', directory: 'my-library' };

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should generate files for the library with the correct substitutions', async () => {
        await createFiles(appTree, options);

        expect(generateFiles).toHaveBeenCalledWith(
            appTree,
            expect.any(String),
            'libs/my-library',
            {
                appName: 'test',
                style: 'scss',
            },
        );
    });
});
