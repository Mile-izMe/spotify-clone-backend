import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: PrismaModuleClass,
    MODULE_OPTIONS_TOKEN: PRISMA_MODULE_OPTIONS_TOKEN,
    OPTIONS_TYPE: PRISMA_MODULE_OPTIONS_TYPE
} = new ConfigurableModuleBuilder()
    .setExtras(
        {
            isGlobal: false
        },
        (definition, extras) => ({
            ...definition,
            global: extras.isGlobal,
        }),
    )
    .build()
