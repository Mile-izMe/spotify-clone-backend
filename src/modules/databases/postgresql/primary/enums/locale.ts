import {
    registerEnumType 
} from "@nestjs/graphql"
import {
    createEnumType 
} from "@modules/common"

/** Supported locales for translations. */
export enum Locale {
    Vi = "vi",
    En = "en",
}

/**
 * GraphQL type for the locale enum.
 */
export const GraphQLTypeLocale = createEnumType(Locale)

/**
 * Register the locale enum with NestJS GraphQL.
 */
registerEnumType(
    GraphQLTypeLocale, 
    {
        name: "Locale",
        description: "Supported locales for translations.",
        valuesMap: {
            [Locale.Vi]: {
                description: "Vietnamese locale.",
            },
            [Locale.En]: {
                description: "English locale.",
            },
        },
    }
)