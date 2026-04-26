import {
    Module,
} from "@nestjs/common"
import {
    FederationApolloServerModuleClass,
    FEDERATION_APOLLO_SERVER_OPTIONS_TYPE,
} from "./federation-apollo-server.module-definition"

@Module({
})
export class FederationApolloServerModule extends FederationApolloServerModuleClass {
    static register(options: typeof FEDERATION_APOLLO_SERVER_OPTIONS_TYPE) {
        const dynamicModule = super.register(options)
        return {
            ...dynamicModule,
            imports: [],
        }
    }
}

