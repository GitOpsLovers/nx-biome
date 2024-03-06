import { readNxJson, updateNxJson, type Tree } from '@nx/devkit';

/**
 * Set generator defaults
 *
 * @param tree The file tree
 */
export default function setGeneratorDefaults(tree: Tree): void {
    const nxJson = readNxJson(tree);

    nxJson.generators = nxJson.generators ?? {};

    nxJson.generators['@gitopslovers/nx-sass:library'] = {
        ...(nxJson.generators['@gitopslovers/nx-sass:library'] || {}),
    };

    updateNxJson(tree, nxJson);
}
