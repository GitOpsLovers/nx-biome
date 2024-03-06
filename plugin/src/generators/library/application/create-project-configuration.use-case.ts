import { ProjectConfiguration, Tree, addProjectConfiguration } from '@nx/devkit';
import { NormalizedSchema } from '../domain/normalized-schema';

/**
 * Create a new project in the workspace.
 *
 * @param tree The current file tree
 * @param options The options provided to the generator
 */
export default function createProjectConfiguration(tree: Tree, options: NormalizedSchema): void {
    const project: ProjectConfiguration = {
        name: options.name,
        projectType: 'library',
        root: `libs/${options.directory}`,
        sourceRoot: `libs/${options.directory}`,
        targets: {
            build: {
                executor: '@gitopslovers/nx-sass:compiler',
                outputs: ['{options.outputPath}'],
                options: {
                    outputPath: 'dist',
                    main: `libs/${options.directory}/src/main.scss`,
                    sourceMap: true,
                },
                configurations: {
                    production: {},
                    development: {},
                },
                defaultConfiguration: 'production',
            },
            serve: {
                executor: '@gitopslovers/nx-sass:compiler',
                options: {
                    watch: true,
                    outputPath: 'dist',
                    main: `libs/${options.directory}/src/main.scss`,
                    sourceMap: true,
                },
            },
            lint: {
                executor: 'nx-stylelint:lint',
                outputs: ['{options.outputFile}'],
                options: {
                    lintFilePatterns: [`libs/${options.directory}/src/**/*.scss`],
                    formatter: 'compact',
                },
            },
        },

    };

    addProjectConfiguration(tree, options.name, project);
}
