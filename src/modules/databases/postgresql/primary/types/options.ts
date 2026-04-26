
import {
    SeedersOptions 
} from "../seeders"

/** Options for primary PostgreSQL module. */
export interface PrimaryPostgresqlOptions {
    /**
     * Options for seeders.
     */
    withSeeders?: SeedersOptions
    /**
     * Whether to include resolvers.
     */
    withResolvers?: boolean
}