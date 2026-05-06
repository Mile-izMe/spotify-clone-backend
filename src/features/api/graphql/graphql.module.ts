import {
    Module,
} from "@nestjs/common"
import {
    AuthModule 
} from "./auth"
import {
    GraphqlConfigurableModuleClass
} from "./graphql.module-definition"
import {
    SongsModule
} from "./songs"
import {
    UserModule
} from "./user"

/**
 * Module for the GraphQL.
 */
@Module({
    imports: [
        SongsModule,
        UserModule,
        AuthModule,
    ],
})
export class GraphQLModule extends GraphqlConfigurableModuleClass {}
