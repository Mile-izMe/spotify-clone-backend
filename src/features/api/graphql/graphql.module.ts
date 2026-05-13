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
    PlaylistsModule,
} from "./playlists"
import {
    UserModule
} from "./user"
import {
    GlobalSearchModule 
} from "./global-search"

/**
 * Module for the GraphQL.
 */
@Module({
    imports: [
        SongsModule,
        PlaylistsModule,
        UserModule,
        AuthModule,
        GlobalSearchModule,
    ],
})
export class GraphQLModule extends GraphqlConfigurableModuleClass {}
