import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: WorkerConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: WORKER_MODULE_OPTIONS_TOKEN,
    OPTIONS_TYPE: WORKER_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .build()
