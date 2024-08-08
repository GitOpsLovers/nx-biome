import { ConfigurationGeneratorSchema } from '../generators/configuration/schema';

/**
 * The normalized schema for the configuration generator
 */
export interface NormalizedSchema extends ConfigurationGeneratorSchema {
    projectRoot: string;
    biomeTargetExists: boolean;
}
