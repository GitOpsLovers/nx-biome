import { Tree, addProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import createProjectConfiguration from '../../../../src/generators/library/application/create-project-configuration.use-case';
import { NormalizedSchema } from '../../../../src/generators/library/domain/normalized-schema';

jest.mock('@nx/devkit', () => ({
    ...jest.requireActual('@nx/devkit'),
    addProjectConfiguration: jest.fn(),
}));

describe('createProjectConfiguration', () => {
    let appTree: Tree;
    const options: NormalizedSchema = { name: 'test', directory: 'my-library' };

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should create a new project configuration in the workspace', () => {
        createProjectConfiguration(appTree, options);

        expect(addProjectConfiguration).toHaveBeenCalledWith(
            appTree,
            'test',
            {
                name: 'test',
                projectType: 'library',
                root: 'libs/my-library',
                sourceRoot: 'libs/my-library',
                targets: {
                    build: {
                        executor: 'nx-sass:compiler',
                        outputs: ['{options.outputPath}'],
                        options: {
                            outputPath: 'dist',
                            main: 'libs/my-library/src/main.scss',
                            sourceMap: true,
                        },
                        configurations: {
                            production: {},
                            development: {},
                        },
                        defaultConfiguration: 'production',
                    },
                    serve: {
                        executor: 'nx-sass:compiler',
                        options: {
                            watch: true,
                            outputPath: 'dist',
                            main: 'libs/my-library/src/main.scss',
                            sourceMap: true,
                        },
                    },
                    lint: {
                        executor: 'nx-stylelint:lint',
                        outputs: ['{options.outputFile}'],
                        options: {
                            lintFilePatterns: ['libs/my-library/src/**/*.scss'],
                            formatter: 'compact',
                        },
                    },
                },
            },
        );
    });
});
