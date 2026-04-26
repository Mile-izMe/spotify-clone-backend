import {
    Module,
} from "@nestjs/common"
import {
    MonolithicApolloServerModuleClass,
    MONOLITHIC_APOLLO_SERVER_OPTIONS_TYPE,
} from "./monolithic-apollo-server.module-definition"
import {
    ApolloDriver,
} from "@nestjs/apollo"
import {
    ApolloDriverConfig,
} from "@nestjs/apollo"
import {
    GraphQLModule,
} from "@nestjs/graphql"
import {
    ApolloServerPluginLandingPageLocalDefault,
} from "@apollo/server/plugin/landingPage/default"

@Module({
})
export class MonolithicApolloServerModule extends MonolithicApolloServerModuleClass {
    static register(options: typeof MONOLITHIC_APOLLO_SERVER_OPTIONS_TYPE) {
        const dynamicModule = super.register(options)
        return {
            ...dynamicModule,
            imports: [
                GraphQLModule.forRoot<ApolloDriverConfig>({
                    driver: ApolloDriver,
                    playground: false,
                    autoSchemaFile: true,
                    plugins: [ApolloServerPluginLandingPageLocalDefault()],
                    context: ({
                        req, res 
                    }) => ({
                        req,
                        res,
                    }),
                }),
            ],
        }
    }
}

