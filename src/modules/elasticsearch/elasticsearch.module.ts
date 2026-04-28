import {
    DynamicModule,
    Module,
} from "@nestjs/common"
import {
    ElasticsearchConfigurableModuleClass,
    ELASTICSEARCH_OPTIONS_TYPE,
} from "./elasticsearch.module-definition"
import {
    createElasticsearchProvider,
} from "./elasticsearch.provider"
import {
    ElasticsearchService,
} from "./elasticsearch.service"

/**
 * Elasticsearch module.
 */
@Module({
})
export class ElasticsearchModule extends ElasticsearchConfigurableModuleClass {
    static register(options: typeof ELASTICSEARCH_OPTIONS_TYPE): DynamicModule {
        const dynamicModule = super.register(options)
        const elasticsearchProvider = createElasticsearchProvider()

        return {
            ...dynamicModule,
            providers: [
                ...(dynamicModule.providers ?? []),
                elasticsearchProvider,
                ElasticsearchService,
            ],
            exports: [
                elasticsearchProvider,
                ElasticsearchService,
            ],
        }
    }
}

