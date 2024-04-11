import { exec } from 'child_process';
import { LintExecutorSchema } from './schema';

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
            console.log(data);
        });

        response.stderr.on('data', (data) => {
            console.error(data);
        });
    });
}

/**
 * Run the lint executor
 *
 * @param options The options for the lint executor
 */
export default async function runExecutor(options: LintExecutorSchema) {
    const lintCommand = `biome lint ${options.lintFilePatterns}`;

    await execPromise(lintCommand);

    return {
        success: true,
    };
}
