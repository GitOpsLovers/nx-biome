import { Tree, generateFiles, joinPathFragments } from '@nx/devkit';
import { NormalizedSchema } from '../domain/normalized-schema';

/**
 * Create files for the library
 *
 * @param tree The current file tree
 * @param options The options provided to the generator
 */
export default async function createFiles(tree: Tree, options: NormalizedSchema): Promise<void> {
    const substitutions = {
        appName: options.name,
        style: 'scss',
    };

    generateFiles(
        tree,
        joinPathFragments(__dirname, '../files'),
        `libs/${options.directory}`,
        substitutions,
    );
}
