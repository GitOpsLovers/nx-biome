import { Schema } from '../schema';

/**
 * Normalized schema for the library generator
 */
export interface NormalizedSchema extends Schema {
    directory: string;
}
