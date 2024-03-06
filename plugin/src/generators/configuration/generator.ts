import type { GeneratorCallback, Tree } from '@nx/devkit';
import {
    formatFiles,
    joinPathFragments,
    logger,
    offsetFromRoot,
    readProjectConfiguration,
    updateProjectConfiguration,
    writeJson,
} from '@nx/devkit';
import type { Config } from 'stylelint';
import type { LintExecutorSchema } from '../../executors/lint/schema';
import { defaultFormatter, isCoreFormatter } from '../../utils/formatter';

import initGenerator from '../init/generator';
import type { ConfigurationGeneratorSchema } from './schema';

interface NormalizedSchema extends ConfigurationGeneratorSchema {
    projectRoot: string;
    biomeTargetExists: boolean;
}

function normalizeSchema(tree: Tree, options: ConfigurationGeneratorSchema): NormalizedSchema {
    const projectConfig = readProjectConfiguration(tree, options.project);

    return {
        ...options,
        linter: options.linter ?? true,
        projectRoot: projectConfig.root,
        biomeTargetExists: !!projectConfig.targets?.biome,
    };
}

function createBiomeConfig(tree: Tree, options: NormalizedSchema) {
    const config = {
        extends: [joinPathFragments(offsetFromRoot(options.projectRoot), '.biome.json')],
        ignoreFiles: ['!**/*'],
        overrides: [
            {
                files: ['**/*.css'],
                rules: {},
            },
        ],
    };

    writeJson<Config>(tree, joinPathFragments(options.projectRoot, '.biome.json'), config);
}

function addBiomeTarget(tree: Tree, options: NormalizedSchema) {
    const projectConfig = readProjectConfiguration(tree, options.project);

    const targetOptions: Partial<LintExecutorSchema> = {
        lintFilePatterns: [joinPathFragments(options.projectRoot, '**', '*.css')],
    };

    projectConfig.targets = {
        ...projectConfig.targets,
        stylelint: {
            executor: 'nx-biome:biome-lint',
            outputs: ['{options.outputFile}'],
            options: targetOptions,
        },
    };
    updateProjectConfiguration(tree, options.project, projectConfig);
}

async function configurationGenerator(
    host: Tree,
    options: ConfigurationGeneratorSchema,
): Promise<void | GeneratorCallback> {
    const init = await initGenerator(host, { linter: options.linter });

    const normalizedOptions = normalizeSchema(host, options);

    if (normalizedOptions.biomeTargetExists) {
        logger.error(`Project '${options.project}' already has a Biome target.`);
        return;
    }

    logger.info(`Adding Stylelint configuration and target to '${options.project}' ...\n`);

    createBiomeConfig(host, normalizedOptions);
    addBiomeTarget(host, normalizedOptions);

    return init;
}

export default configurationGenerator;
