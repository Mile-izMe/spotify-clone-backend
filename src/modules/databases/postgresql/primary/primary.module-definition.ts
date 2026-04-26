import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"
import {
    PrimaryPostgresqlOptions 
} from "./types"



export const { 
    ConfigurableModuleClass: PostgresqlModuleClass, 
    MODULE_OPTIONS_TOKEN: PRIMARY_POSTGRESQL_OPTIONS_TOKEN, 
    OPTIONS_TYPE: PRIMARY_POSTGRESQL_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder<PrimaryPostgresqlOptions>().setExtras(
        {
            isGlobal: false
        },
        (definition, extras) => ({
            ...definition,
            global: extras.isGlobal
        })
    ).build()
