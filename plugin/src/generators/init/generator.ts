import {
    GeneratorCallback, Tree, addDependenciesToPackageJson, formatFiles, installPackagesTask,
    readJson,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/js';

function updateDependencies(tree: Tree): GeneratorCallback {
    const packageJson = readJson(tree, 'package.json');
    const devDependencies: Record<string, string> = {};

    return addDependenciesToPackageJson(tree, {}, devDependencies);
}

export default async function (tree: Tree, options: any) {
    const installTask = updateDependencies(tree);
}
