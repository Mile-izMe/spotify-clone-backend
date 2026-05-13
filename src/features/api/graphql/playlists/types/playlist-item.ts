import {
    Field,
    Int,
    ObjectType,
} from "@nestjs/graphql"

@ObjectType()
export class PlaylistItem {
    @Field(() => String)
        id: string

    @Field(() => String)
        name: string

    @Field(() => Int)
        songCount: number

    @Field(() => Date)
        createdAt: Date

    @Field(() => Date)
        updatedAt: Date
}

export interface PlaylistItemSource {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count?: {
        songs: number
    }
}

export function toPlaylistItem(source: PlaylistItemSource): PlaylistItem {
    return {
        id: source.id,
        name: source.name,
        songCount: source._count?.songs ?? 0,
        createdAt: source.createdAt,
        updatedAt: source.updatedAt,
    }
}
