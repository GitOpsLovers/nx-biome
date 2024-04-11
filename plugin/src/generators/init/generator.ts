import {
    GeneratorCallback,
    Tree,
    addDependenciesToPackageJson,
    joinPathFragments,
    logger,
    readJson,
    readNxJson,
    updateNxJson as devkitUpdateNxJson,
    stripIndents,
} from '@nx/devkit';
import { biomeConfigFile } from '../../utils/config-file';
import { biomeVersion } from '../../utils/versions';
import { InitGeneratorSchema } from './schema';

/**
 * Update the package.json file with the required dependencies.
 */
function updateDependencies(tree: Tree): GeneratorCallback {
    const packageJson = readJson(tree, 'package.json');
    const devDependencies: Record<string, string> = {};

    //
    if (!packageJson.dependencies?.stylelint) {
        devDependencies['@biomejs/biome'] = biomeVersion;
    }

    return addDependenciesToPackageJson(tree, {}, devDependencies);
}

/**
 * Update the nx.json file with the required configuration.
 */
function updateNxJson(tree: Tree) {
    const nxJson = readNxJson(tree);
    if (!nxJson) {
        logger.warn(
            stripIndents`nx.json not found. Create a nx.json file and rerun the generator with \'nx run nx-biome:init\'`,
        );
        return;
    }

    const biomeProjectConfigFile = `!${joinPathFragments('{projectRoot}', biomeConfigFile)}`;

    // Add Biome configuration file to the namedInputs.production array
    if (
        nxJson.namedInputs?.production
      && !nxJson.namedInputs?.production.includes(biomeProjectConfigFile)
    ) {
        nxJson.namedInputs?.production.push(biomeProjectConfigFile);
    }

    // Set targetDefault for Biome
    nxJson.targetDefaults ??= {};
    nxJson.targetDefaults['lint-biome'] ??= {};
    nxJson.targetDefaults['lint-biome'].inputs ??= ['default'];
    nxJson.targetDefaults['lint-biome'].cache = true;

    const rootBiomeConfigurationFile = joinPathFragments('{workspaceRoot}', biomeConfigFile);

    if (!nxJson.targetDefaults['lint-biome'].inputs.includes(rootBiomeConfigurationFile)) {
        nxJson.targetDefaults['lint-biome'].inputs.push(rootBiomeConfigurationFile);
    }

    devkitUpdateNxJson(tree, nxJson);
}

/**
 * Initialize the generator.
 */
async function initGenerator(tree: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
    const installTask = updateDependencies(tree);

    updateNxJson(tree);

    return installTask;
}

export default initGenerator;
