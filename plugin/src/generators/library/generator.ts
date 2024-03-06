import { GeneratorCallback, Tree, installPackagesTask } from '@nx/devkit';
import { logShowProjectCommand } from '@nx/devkit/src/utils/log-show-project-command';
import { Schema } from './schema';
import addDependencies from './application/add-dependencies.use-case';
import addStylelintConfig from './application/add-stylelint-config.use-case';
import addStylelintRootConfig from './application/add-stylelint-root-config.use-case';
import createFiles from './application/create-files.use-case';
import createProjectConfiguration from './application/create-project-configuration.use-case';
import normalizeOptions from './application/normalize-options.use-case';
import setGeneratorDefaults from './application/set-generator-defaults.use-case';

/**
 * Library generator
 *
 * @param tree The current file tree
 * @param schema The options provided to the generator
 *
 * @returns A generator callback
 */
export async function libraryGenerator(tree: Tree, schema: Partial<Schema>): Promise<GeneratorCallback> {
    const options = await normalizeOptions(tree, schema);

    console.log('⚙️ Generating library...');

    createProjectConfiguration(tree, options);

    await createFiles(tree, options);

    setGeneratorDefaults(tree);

    addDependencies(tree);

    addStylelintRootConfig(tree);

    addStylelintConfig(tree, options);

    return () => {
        installPackagesTask(tree);
        logShowProjectCommand(options.name);
    };
}

export default libraryGenerator;
