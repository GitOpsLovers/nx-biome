import { exec } from 'node:child_process';
import type { LintExecutorSchema } from './schema';

/**
 * Execute a command and return a promise
 *
 * @param cmd The command to execute
 *
 * @returns A promise that resolves with the output of the command
 */
export function execPromise(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const response = exec(cmd, (err, data) => {
            response.removeAllListeners();

            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });

        response.stdout.on('data', (data) => {
            // eslint-disable-next-line no-console
            console.log(data);
        });

        response.stderr.on('data', (data) => {
            // eslint-disable-next-line no-console
            console.error(data);
        });
    });
}

/**
 * Run the lint executor
 *
 * @param options The options for the lint executor
 *
 * @returns A promise that resolves with the result of the lint executor
 */
export default async function runExecutor(options: LintExecutorSchema) {
    let lintCommand = `biome lint ${options.lintFilePatterns}`;

    if (options.write) {
        lintCommand += ' --write';
    }

    if (options.unsafe) {
        lintCommand += ' --unsafe';
    }

    await execPromise(lintCommand);

    return {
        success: true,
    };
}
