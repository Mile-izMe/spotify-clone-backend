import {
    Prisma,
} from "@prisma/client"
import {
    SortOrder,
} from "@modules/api"

export function buildSongOrderBy(
    sorts?: Array<{ by: string; order: SortOrder }>,
): Prisma.SongOrderByWithRelationInput[] {
    if (!sorts?.length) {
        return [
            {
                createdAt: "desc",
            },
        ]
    }

    return sorts.map((sort) => {
        const direction: Prisma.SortOrder = sort.order === SortOrder.Asc
            ? "asc"
            : "desc"

        if (sort.by === "title") {
            return {
                title: direction,
            }
        }

        if (sort.by === "updatedAt") {
            return {
                updatedAt: direction,
            }
        }

        return {
            createdAt: direction,
        }
    })
}

export function buildSongWhere(search?: string): Prisma.SongWhereInput {
    const keyword = search?.trim()

    if (!keyword) {
        return {
        }
    }

    return {
        OR: [
            {
                title: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
            {
                artist: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
        ],
    }
}
