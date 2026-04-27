import {
    Module,
} from "@nestjs/common"
import {
    GraphqlConfigurableModuleClass
} from "./graphql.module-definition"
import {
    SongsModule 
} from "./songs"

/**
 * Module for the GraphQL.
 */
@Module({
    imports: [
        SongsModule
    ],
})
export class GraphQLModule extends GraphqlConfigurableModuleClass {}
