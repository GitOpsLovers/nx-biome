import { type Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { NormalizedSchema } from '../domain/normalized-schema';
import { Schema } from '../schema';

/**
 * Normalizes the options for the library generator
 *
 * @param host The file tree
 * @param options The options provided by the user
 *
 * @returns The normalized options
 */
export default async function normalizeOptions(host: Tree, options: Partial<Schema>): Promise<NormalizedSchema> {
    const { projectName: appProjectName } = await determineProjectNameAndRootOptions(host, {
        name: options.name,
        projectType: 'library',
        directory: options.directory,
        callingGenerator: '@gitopslovers/nx-sass:library',
    });

    // Set defaults and then overwrite with user options
    return { ...options, name: appProjectName, directory: options.directory };
}
