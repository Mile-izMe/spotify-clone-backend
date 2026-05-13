/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    Client,
} from "@elastic/elasticsearch"
import {
    AsyncService,
    ReadinessWatcherFactoryService
} from "@modules/mixin"
import {
    Injectable,
    OnModuleInit,
} from "@nestjs/common"
import {
    configMap
} from "./config"
import {
    InjectElasticsearch,
} from "./elasticsearch.decorators"
import {
    SearchParam
} from "./types"
import { 
    ElasticsearchQueryBuilder 
} from "./utils"

/**
 * The service for the Elasticsearch.
 */
@Injectable()
export class ElasticsearchService implements OnModuleInit {
    /**
     * The indices to create.
     */
    private readonly indices: Array<string> = [
        "Song",
        "User",
        "Playlist",
    ]

    constructor(
    @InjectElasticsearch()
    public readonly client: Client,
    private readonly asyncService: AsyncService,
    private readonly readinessWatcherFactoryService: ReadinessWatcherFactoryService,
    ) {}

    /**
     * On module initialization, ensure the index exists.
     */
    async onModuleInit() {
        this.readinessWatcherFactoryService.createWatcher(
            ElasticsearchService.name
        )
        // ensure the indices exist
        await this.asyncService.allIgnoreError(
            this.indices.map(entity => {
                return this.setupEntityIndex(this.indicateName(entity))
            }),
        )
    }

    /**
     * Indicate the index name.
     * @param entity - Entity to indicate the index name.
     * @returns Index name.
     */
    private indicateName(entity: string) {
        return configMap[entity].indices
    }

    /**
     * Setup the index for the entity.
     * @param entity 
     * @returns 
     */
    private async setupEntityIndex(entity: string): Promise<void> {
        const indexName = this.indicateName(entity)
        const existsResult = await this.client.indices.exists({
            index: indexName 
        })
        const exists = typeof existsResult === "boolean" ? existsResult : (existsResult as any).body

        if (exists) return

        // Analyzer Setting support Vietnamese (asciifolding) & lowercase
        const settings = {
            analysis: {
                analyzer: {
                    vi_analyzer: {
                        type: "custom",
                        tokenizer: "standard",
                        filter: ["lowercase",
                            "asciifolding"]
                    }
                }
            }
        }

        // Get mappings from Config
        const mappings = configMap[entity]?.mappings || {
        }

        // Tạo Index với Settings và Mappings
        await this.client.indices.create({
            index: indexName,
            settings: settings as any,
            ...(mappings ? {
                mappings 
            } : {
            }),
        })
    }

    /**
     * Index the entity.
     */
    async indexEntity<T extends Record<string, any>>(
        entityName: string,
        data: T,
        docId?: string,
    ) {
        await this.client.index({
            index: this.indicateName(entityName),
            id: docId ?? data.id,
            body: data,
        })
    }

    /**
   * Index the entities.
   */
    async indexEntities<T extends Record<string, any>>(
        entityName: string,
        data: Array<T>,
    ) {
        await this.client.bulk({
            body: data.flatMap((item) => [
                {
                    index: {
                        _index: this.indicateName(entityName),
                        _id: item.id,
                    },
                },
                item,
            ]),
        })
    }


    async search<T>(
        entityName: string, 
        params: SearchParam & { keyword?: string }
    ) {
        const entityConfig = configMap[entityName]

        // Use builder to build query
        const esQuery = ElasticsearchQueryBuilder.buildSearchQuery({
            search: params.keyword,
            searchFields: entityConfig.searchFields,
            filters: params.query ? [params.query] : [],
        })

        // Execute search query
        const response = await this.client.search({
            index: this.indicateName(entityName),
            from: params.from,
            size: params.size,
            query: esQuery,
            sort: params.sort,
        })

        const total = response.hits.total
        const count = typeof total === "number" ? total : total?.value || 0
        const data = response.hits.hits.map((hit) => hit._source as T)
    
        return {
            data,
            count,
        }
    }
}
