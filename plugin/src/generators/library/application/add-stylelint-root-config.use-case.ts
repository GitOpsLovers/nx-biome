import { Tree, writeJson } from '@nx/devkit';
import type { Config } from 'stylelint';

/**
 * Add Stylelint root configuration to the project
 *
 * @param tree The current file tree
 */
export default function addStylelintRootConfig(tree: Tree): void {
    const config = {
        ignoreFiles: ['**/*'],
        overrides: [
            {
                files: ['**/*.scss'],
                extends: ['stylelint-config-standard-scss'],
                rules: {},
            },
        ],
        rules: {},
    };

    writeJson<Config>(tree, '.stylelintrc.json', config);
}
