import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

/**
 * The configurable module class for the Mixin module.
 */
export const {
    ConfigurableModuleClass: MixinConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: MIXIN_MODULE_OPTIONS_TOKEN, 
    OPTIONS_TYPE: MIXIN_OPTIONS_TYPE
}
    =
  new ConfigurableModuleBuilder().setExtras(
      {
          isGlobal: false
      },
      (definition, extras) => ({
          ...definition,
          global: extras.isGlobal
      })
  ).build()
