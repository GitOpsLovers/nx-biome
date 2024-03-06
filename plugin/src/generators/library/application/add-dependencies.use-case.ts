import { GeneratorCallback, Tree, addDependenciesToPackageJson } from '@nx/devkit';

/**
 * Add dependencies to package.json
 *
 * @param tree The current file tree
 *
 * @returns A generator callback
 */
export default function addDependencies(tree: Tree): GeneratorCallback {
    return addDependenciesToPackageJson(
        tree,
        {},
        {
            sass: '1.71.0',
            stylelint: '16.2.1',
            'stylelint-config-standard-scss': '13.0.0',
            'nx-stylelint': '17.1.4',
        },
        undefined,
        false,
    );
}
