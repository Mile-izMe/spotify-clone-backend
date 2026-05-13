import {
    PaginationPageFilters,
    SortInput,
} from "@modules/api"
import {
    createEnumType,
} from "@modules/common"
import {
    Field,
    InputType,
    registerEnumType,
} from "@nestjs/graphql"

export enum PlaylistsSortBy {
    Name = "name",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

const GraphQLTypePlaylistsSortBy = createEnumType(PlaylistsSortBy)

registerEnumType(GraphQLTypePlaylistsSortBy,
    {
        name: "PlaylistsSortBy",
        description: "Sort field for listing current user playlists.",
        valuesMap: {
            [PlaylistsSortBy.Name]: {
                description: "Sort by playlist name",
            },
            [PlaylistsSortBy.CreatedAt]: {
                description: "Sort by created at",
            },
            [PlaylistsSortBy.UpdatedAt]: {
                description: "Sort by updated at",
            },
        },
    })

@InputType({
    description: "Sort field and order for listing current user playlists.",
})
export class PlaylistsRequestSort extends SortInput<PlaylistsSortBy> {
    @Field(
        () => GraphQLTypePlaylistsSortBy,
        {
            description: "Sort by",
        },
    )
        by: PlaylistsSortBy
}

@InputType({
    description: "Pagination and sorting filters for current user playlists.",
})
export class PlaylistsRequestPaginationFilters extends PaginationPageFilters<PlaylistsSortBy> {
    @Field(
        () => String,
        {
            nullable: true,
            description: "Cursor of the last item from previous page.",
        },
    )
        cursor?: string

    @Field(
        () => [PlaylistsRequestSort],
        {
            nullable: true,
            description: "Sorts",
        },
    )
        sorts?: Array<PlaylistsRequestSort>
}

@InputType({
    description: "Request for listing current user playlists with pagination.",
})
export class GetMyPlaylistsRequest {
    @Field(
        () => PlaylistsRequestPaginationFilters,
        {
            description: "Pagination and sort filters.",
        },
    )
        filters: PlaylistsRequestPaginationFilters
}
