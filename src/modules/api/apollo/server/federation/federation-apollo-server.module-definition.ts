import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

/** Dynamic module definition for FederationApolloServerModule. */
export const {
    ConfigurableModuleClass: FederationApolloServerModuleClass,
    MODULE_OPTIONS_TOKEN: FEDERATION_APOLLO_SERVER_OPTIONS_TOKEN,
    OPTIONS_TYPE: FEDERATION_APOLLO_SERVER_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder()
    .setExtras(
        {
            isGlobal: false,
        },
        (definition, extras) => ({
            ...definition,
            global: extras.isGlobal,
        }),
    )
    .build()
