import {
    GeneratorCallback,
    Tree,
    addDependenciesToPackageJson,
    joinPathFragments,
    logger,
    readJson,
    readNxJson,
    updateNxJson as devkitUpdateNxJson,
} from '@nx/devkit';
import biomeConfigFilePattern from '../../utils/config-file';
import { biomeVersion } from '../../utils/versions';

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

function updateNxJson(tree: Tree) {
    const nxJson = readNxJson(tree);
    if (!nxJson) {
        logger.warn(
            stripIndents`nx.json not found. Create a nx.json file and rerun the generator with 'nx run nx-stylelint:init' to configure nx-stylelint inputs and taskrunner options.`,
        );
        return;
    }

    // remove stylelint config files from production inputs
    const stylelintProjectConfigFilePattern = `!${joinPathFragments('{projectRoot}', biomeConfigFilePattern)}`;
    if (
        nxJson.namedInputs?.production
      && !nxJson.namedInputs?.production.includes(stylelintProjectConfigFilePattern)
    ) {
        nxJson.namedInputs?.production.push(stylelintProjectConfigFilePattern);
    }

    // Set targetDefault for stylelint
    nxJson.targetDefaults ??= {};
    nxJson.targetDefaults.stylelint ??= {};
    nxJson.targetDefaults.stylelint.inputs ??= ['default'];
    nxJson.targetDefaults.stylelint.cache = true;

    const rootStylelintConfigurationFile = joinPathFragments('{workspaceRoot}', biomeConfigFilePattern);
    if (!nxJson.targetDefaults.stylelint.inputs.includes(rootStylelintConfigurationFile)) {
        nxJson.targetDefaults.stylelint.inputs.push(rootStylelintConfigurationFile);
    }

    devkitUpdateNxJson(tree, nxJson);
}

export default async function (tree: Tree, options: any) {
    const installTask = updateDependencies(tree);

    updateNxJson(tree);
}
