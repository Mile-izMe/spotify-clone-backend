import {
    SortOrder,
} from "@modules/api"
import {
    Prisma,
} from "@prisma/client"

export function buildPlaylistOrderBy(
    sorts?: Array<{ by: string; order: SortOrder }>,
): Prisma.PlaylistOrderByWithRelationInput[] {
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

        if (sort.by === "name") {
            return {
                name: direction,
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

export function buildPlaylistWhere(search?: string): Prisma.PlaylistWhereInput {
    const keyword = search?.trim()

    if (!keyword) {
        return {
        }
    }

    return {
        name: {
            contains: keyword,
            mode: "insensitive",
        },
    }
}
