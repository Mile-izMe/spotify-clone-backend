import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"
import {
    RedisOptions 
} from "./types"

export const {
    ConfigurableModuleClass: RedisConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: REDIS_OPTIONS_TOKEN, 
    OPTIONS_TYPE: REDIS_OPTIONS_TYPE 
} =
  new ConfigurableModuleBuilder<RedisOptions>()
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
