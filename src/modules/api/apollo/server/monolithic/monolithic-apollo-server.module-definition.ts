import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

/** Dynamic module definition for MonolithicApolloServerModule. */
export const {
    ConfigurableModuleClass: MonolithicApolloServerModuleClass,
    MODULE_OPTIONS_TOKEN: MONOLITHIC_APOLLO_SERVER_OPTIONS_TOKEN,
    OPTIONS_TYPE: MONOLITHIC_APOLLO_SERVER_OPTIONS_TYPE,
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
