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
     * Indicate the index name.
     * @param entity - Entity to indicate the index name.
     * @returns Index name.
     */
    private indicateName(entity: string) {
        return configMap[entity].indices
    }

    /**
     * On application bootstrap, ensure the index exists.
     */
    async onModuleInit() {
        this.readinessWatcherFactoryService.createWatcher(
            ElasticsearchService.name
        )
        // ensure the indices exist
        await this.asyncService.allIgnoreError(
            this.indices.map(index => {
                return this.ensureIndexExists(this.indicateName(index))
            }),
        )
    }

    /**
   * Ensure the index exists.
   */
    async ensureIndexExists(
        index: string,
        create?: Omit<Parameters<Client["indices"]["create"]>[0], "index">,
    ): Promise<void> {
        const existsResult = await this.client.indices.exists({
            index,
        })
        const exists =
      typeof existsResult === "boolean"
          ? existsResult
          : (
            existsResult as {
              body: boolean;
            }
          ).body

        if (exists) return

        await this.client.indices.create({
            index,
            ...(create ?? {
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
        params: SearchParam
    ) {
        const response = await this.client.search({
            index: this.indicateName(entityName),
            from: params.from,
            size: params.size,
            query: params.query || {
                match_all: {
                } 
            },
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
