import { Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import normalizeOptions from '../../../../src/generators/library/application/normalize-options.use-case';
import { NormalizedSchema } from '../../../../src/generators/library/domain/normalized-schema';

jest.mock('@nx/devkit/src/generators/project-name-and-root-utils', () => ({
    ...jest.requireActual('@nx/devkit/src/generators/project-name-and-root-utils'),
    determineProjectNameAndRootOptions: jest.fn().mockResolvedValue({ projectName: 'appProjectName' }),
}));

describe('normalizeOptions', () => {
    let appTree: Tree;
    const options: NormalizedSchema = { name: 'test', directory: 'my-library' };

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should normalize the options correctly', async () => {
        const normalizedOptions: NormalizedSchema = await normalizeOptions(appTree, options);

        expect(determineProjectNameAndRootOptions).toHaveBeenCalledWith(appTree, {
            name: 'test',
            projectType: 'library',
            directory: 'my-library',
            callingGenerator: '@gitopslovers/nx-sass:library',
        });

        expect(normalizedOptions).toEqual({
            name: 'appProjectName',
            directory: 'my-library',
        });
    });
});
