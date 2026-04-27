import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"

/**
 * BullMQ module definition.
 * Configures the bullmq module with dynamic options.
 */
export const {
    ConfigurableModuleClass: BullmqConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: BULLMQ_OPTIONS_TOKEN, 
    OPTIONS_TYPE: BULLMQ_OPTIONS_TYPE 
} =
  new ConfigurableModuleBuilder()
      .setClassMethodName("forRoot")
      .build()
