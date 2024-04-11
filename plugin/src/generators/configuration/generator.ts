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

    writeJson(tree, joinPathFragments(options.projectRoot, '.biome.json'), config);
}

function addBiomeTarget(tree: Tree, options: NormalizedSchema) {
    const projectConfig = readProjectConfiguration(tree, options.project);

    const targetOptions: Partial<LintExecutorSchema> = {
        lintFilePatterns: [joinPathFragments(options.projectRoot, '**', '*.ts')],
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

async function configurationGenerator(
    host: Tree,
    options: ConfigurationGeneratorSchema,
): Promise<GeneratorCallback> {
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
