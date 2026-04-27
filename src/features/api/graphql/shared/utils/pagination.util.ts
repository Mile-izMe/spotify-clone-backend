const DEFAULT_LIMIT = 20
const DEFAULT_MAX_LIMIT = 100

export function normalizeLimit(
    limit?: number,
    options?: {
        defaultLimit?: number
        maxLimit?: number
    },
): number {
    const defaultLimit = options?.defaultLimit ?? DEFAULT_LIMIT
    const maxLimit = options?.maxLimit ?? DEFAULT_MAX_LIMIT

    return Math.min(Math.max(limit ?? defaultLimit,
        1),
    maxLimit)
}

export function normalizePageNumber(pageNumber?: number): number {
    return Math.max(pageNumber ?? 1,
        1)
}
