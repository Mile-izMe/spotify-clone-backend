import {
    ReadinessWatcherFactoryService,
} from "@modules/mixin"
import {
    Inject, Injectable, OnModuleInit
} from "@nestjs/common"
import {
    EntityManager
} from "typeorm"
import {
    InjectPrimaryPostgreSQLEntityManager
} from "../primary.decorators"
import {
    MODULE_OPTIONS_TOKEN, OPTIONS_TYPE
} from "./seeders.module-definition"
/**
 * The service for the Seeders.
 */
@Injectable()
export class SeedersService implements OnModuleInit {
    constructor(
        @Inject(MODULE_OPTIONS_TOKEN)
        private readonly options: typeof OPTIONS_TYPE,
        @InjectPrimaryPostgreSQLEntityManager()
        private readonly entityManager: EntityManager,
        private readonly readinessWatcherFactoryService: ReadinessWatcherFactoryService,
    ) { }

    /**
     * Process the seeding and dropping.
     * @returns void.
     */
    private async process() {
        const seeders = Array.isArray(this.options.seeders)
            ? this.options.seeders
            : this.options.seeders
                ? [this.options.seeders]
                : []

        for (const seeder of seeders) {
            await seeder.seed(this.entityManager)
        }
    }

    /**
     * On module init.
     * @returns void.
     */
    async onModuleInit() {
        this.readinessWatcherFactoryService.createWatcher(SeedersService.name)
        // if manual seed, do not seed
        if (this.options.manualSeed) {
            this.readinessWatcherFactoryService.setReady(SeedersService.name)
            return
        }
        await this.process()
        this.readinessWatcherFactoryService.setReady(SeedersService.name)
    }

    /**
     * Seed the data.
     * @returns void.
     */
    async seed() {
        await this.process()
    }
}