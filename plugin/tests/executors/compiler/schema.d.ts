/**
 * Schema for the compile executor options
 */
export interface CompileExecutorSchema {
    outputPath: string;
    main: string;
    sourceMap: boolean;
    watch: boolean;
}
