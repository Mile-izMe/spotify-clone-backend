import {
    Module,
} from "@nestjs/common"
import {
    MutationsModule,
} from "./mutations"
import {
    QueriesModule,
} from "./queries"
import {
    GraphqlConfigurableModuleClass 
} from "./graphql.module-definition"

/**
 * Module for the GraphQL.
 */
@Module({
    imports: [
        QueriesModule.register({
            isGlobal: true,
        }),
        MutationsModule.register({
            isGlobal: true,
        }),
    ],
})
export class GraphQLModule extends GraphqlConfigurableModuleClass {}
