import {
    ConfigurableModuleBuilder 
} from "@nestjs/common"
import {
    IoRedisOptions 
} from "./types"

export const {
    ConfigurableModuleClass: IoRedisConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: IOREDIS_OPTIONS_TOKEN, 
    OPTIONS_TYPE: IOREDIS_OPTIONS_TYPE 
} =
  new ConfigurableModuleBuilder<IoRedisOptions>()
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
