import {
    Tree, joinPathFragments, offsetFromRoot, writeJson,
} from '@nx/devkit';
import type { Config } from 'stylelint';
import { NormalizedSchema } from '../domain/normalized-schema';

/**
 * Add Stylelint configuration to the project
 *
 * @param tree The current file tree
 * @param options The options provided to the generator
 */
export default function addStylelintConfig(tree: Tree, options: NormalizedSchema): void {
    const config = {
        extends: [joinPathFragments(offsetFromRoot(`libs/${options.directory}`), '.stylelintrc.json')],
        ignoreFiles: ['!**/*'],
        overrides: [
            {
                files: ['**/*.scss'],
                rules: {},
            },
        ],
    };

    writeJson<Config>(tree, joinPathFragments('libs/', options.directory, '.stylelintrc.json'), config);
}
