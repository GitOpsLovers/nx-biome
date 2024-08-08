import type { GeneratorCallback, Tree } from '@nx/devkit';
import {
    joinPathFragments,
    logger,
    offsetFromRoot,
    readProjectConfiguration,
    updateProjectConfiguration,
    writeJson,
} from '@nx/devkit';
import type { LintExecutorSchema } from '../../executors/lint/schema';
import initGenerator from '../init/generator';
import { NormalizedSchema } from '../../utils/normalized.schema';
import type { ConfigurationGeneratorSchema } from './schema';

/**
 * Normalize the schema options
 *
 * @param tree The file tree
 * @param options The options to normalize
 *
 * @returns The normalized options
 */
function normalizeSchema(tree: Tree, options: ConfigurationGeneratorSchema): NormalizedSchema {
    const projectConfig = readProjectConfiguration(tree, options.project);

    return {
        ...options,
        linter: options.linter ?? true,
        projectRoot: projectConfig.root,
        biomeTargetExists: !!projectConfig.targets?.biome,
    };
}

/**
 * Create a Biome configuration file
 *
 * @param tree The file tree
 * @param options The options for the configuration file creation
 */
function createBiomeConfig(tree: Tree, options: NormalizedSchema): void {
    const config = {
        extends: [joinPathFragments(offsetFromRoot(options.projectRoot), 'biome.json')],
        linter: {
            enabled: false,
            rules: {},
        },
    };

    if (options.linter) {
        config.linter.enabled = true;
        config.linter.rules = {
            recommended: true,
        };
    }

    writeJson(tree, joinPathFragments(options.projectRoot, 'biome.json'), config);
}

/**
 * Add a Biome target to a project
 *
 * @param tree The file tree
 * @param options The options for the target addition
 */
function addBiomeTarget(tree: Tree, options: NormalizedSchema): void {
    const projectConfig = readProjectConfiguration(tree, options.project);

    const targetOptions: Partial<LintExecutorSchema> = {
        lintFilePatterns: [joinPathFragments(options.projectRoot, '**', '*.ts')],
        write: false,
        unsafe: false,
    };

    projectConfig.targets = {
        ...projectConfig.targets,
        'biome-lint': {
            executor: '@gitopslovers/nx-biome:biome-lint',
            outputs: ['{options.outputFile}'],
            options: targetOptions,
        },
    };

    updateProjectConfiguration(tree, options.project, projectConfig);
}

/**
 * Generate a Biome configuration and target for a project
 *
 * @param host The file tree
 * @param options The options for the configuration generator
 *
 * @returns A promise that resolves with the generator callback
 */
async function configurationGenerator(host: Tree, options: ConfigurationGeneratorSchema): Promise<GeneratorCallback> {
    const init = await initGenerator(host, { linter: options.linter });

    const normalizedOptions = normalizeSchema(host, options);

    if (normalizedOptions.biomeTargetExists) {
        logger.error(`Project '${options.project}' already has a Biome target.`);
        return;
    }

    logger.info(`🛠️ Adding Biome linter configuration and target to '${options.project}'...\n`);

    createBiomeConfig(host, normalizedOptions);
    addBiomeTarget(host, normalizedOptions);

    return init;
}

export default configurationGenerator;
