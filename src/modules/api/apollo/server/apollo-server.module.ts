import {
    DynamicModule,
    Module,
} from "@nestjs/common"
import {
    ApolloServerConfigurableModuleClass,
    APOLLO_SERVER_OPTIONS_TYPE,
} from "./apollo-server.module-definition"
import {
    ApolloServerType,
} from "./enums"
import {
    MonolithicApolloServerModule,
} from "./monolithic"
import {
    FederationApolloServerModule,
} from "./federation"
import {
    ServicesModule,
} from "./services"

/**
 * Nest module that registers Apollo Server (monolithic or federation) and optional services.
 *
 * @example
 * ApolloServerModule.register({ type: ApolloServerType.Monolithic, useServices: true })
 */
@Module({
})
export class ApolloServerModule extends ApolloServerConfigurableModuleClass {
    static register(options: typeof APOLLO_SERVER_OPTIONS_TYPE): DynamicModule {
        const dynamicModule = super.register(options)
        const modules: Array<DynamicModule> = []

        // add server module by type
        switch (options.type) {
        case ApolloServerType.Monolithic:
            modules.push(MonolithicApolloServerModule.register(options))
            break
        case ApolloServerType.Federation:
            modules.push(FederationApolloServerModule.register(options))
            break
        }
        if (options.useServices) {
            modules.push(ServicesModule.register(options))
        }

        return {
            ...dynamicModule,
            providers: [
                ...(dynamicModule.providers ?? []),
            ],
            imports: [...modules],
            exports: [...modules],
        }
    }
}