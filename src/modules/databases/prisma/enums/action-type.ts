import {
    createEnumType 
} from "@modules/common/utils/enum"
import {
    registerEnumType 
} from "@nestjs/graphql"

/**
 * The type of action performed on a preflight transaction.
 */
export enum ActionType {
    /**
     * The action type for a process music.
     */
    ProcessMusic = "processMusic",
}

export const GraphQLTypeActionType = createEnumType(ActionType)

/**
 * Register the action type enum with NestJS GraphQL.
 */
registerEnumType(
    GraphQLTypeActionType,
    {
        name: "ActionType",
        description: "The type of action performed on a preflight transaction.",
        valuesMap: {
            [ActionType.ProcessMusic]: {
                description: "The action type for a process music.",
            },
        },
    },
)