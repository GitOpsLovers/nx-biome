/**
 * Schema for the lint executor options
 */
export interface LintExecutorSchema {
    lintFilePatterns: string[];
    write: boolean;
    unsafe: boolean;
}
