import {
    Injectable 
} from "@nestjs/common"
import {
    AsyncLocalStorage 
} from "async_hooks"

export type RequestUser = {
    id?: string
    username?: string
}

@Injectable()
export class RequestContextService {
    private als = new AsyncLocalStorage<Map<string, unknown>>()

    run<T>(store: Map<string, unknown>, fn: () => T): T {
        return this.als.run(store, fn)
    }

    set(key: string, value: unknown) {
        const store = this.als.getStore()
        if (store) store.set(key, value)
    }

    get<T = unknown>(key: string): T | undefined {
        const store = this.als.getStore()
        if (!store) return undefined
        return store.get(key) as T | undefined
    }

    setUser(user: RequestUser) {
        this.set("user", user)
    }

    getUser(): RequestUser | undefined {
        return this.get<RequestUser>("user")
    }
}
