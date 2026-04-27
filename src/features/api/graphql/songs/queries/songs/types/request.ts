import {
    PaginationPageFilters,
    SortInput,
    SortOrder,
} from "@modules/api"
import {
    createEnumType,
} from "@modules/common"
import {
    Field,
    InputType,
    registerEnumType
} from "@nestjs/graphql"

/** Sort fields for listing module challenges. */
export enum SongsSortBy {
    Title = "title",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

const GraphQLTypeSongsSortBy = createEnumType(SongsSortBy)

registerEnumType(GraphQLTypeSongsSortBy,
    {
        name: "SongsSortBy",
        description: "Sort field for listing Songs within a content item.",
        valuesMap: {
            [SongsSortBy.Title]: {
                description: "Sort by title",
            },
            [SongsSortBy.CreatedAt]: {
                description: "Sort by created at",
            },
            [SongsSortBy.UpdatedAt]: {
                description: "Sort by updated at",
            },
        },
    }
)

@InputType({
    description: "Sort field and order for listing Songs within a content item.",
})
export class SongsRequestSort extends SortInput<SongsSortBy> {
    @Field(
        () => GraphQLTypeSongsSortBy,
        {
            description: "Sort by",
        },
    )
        by: SongsSortBy
}

@InputType({
    description: "Pagination, sort, and content scope for listing Songs.",
})
export class SongsRequestPaginationFilters extends PaginationPageFilters<SongsSortBy> {
    @Field(
        () => String,
        {
            nullable: true,
            description: "Cursor of the last item from previous page.",
        },
    )
        cursor?: string

    @Field(
        () => [SongsRequestSort],
        {
            defaultValue: [
                {
                    by: SongsSortBy.Title,
                    order: SortOrder.Asc,
                },
            ],
            description: "Sorts",
        },
    )
        sorts: Array<SongsRequestSort>
}

@InputType({
    description: "Request for listing Songs in a content item with pagination.",
})
export class SongsRequest {
    @Field(
        () => SongsRequestPaginationFilters,
        {
            description: "Pagination and sort filters.",
        },
    )
        filters: SongsRequestPaginationFilters
}
