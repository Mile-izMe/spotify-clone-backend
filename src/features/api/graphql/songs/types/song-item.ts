import {
    Field,
    Int,
    ObjectType,
} from "@nestjs/graphql"

@ObjectType()
export class SongItem {
    @Field(() => String)
        id: string

    @Field(() => String)
        title: string

    @Field(() => String)
        artist: string

    @Field(() => String)
        audioUrl: string

    @Field(() => String,
        {
            nullable: true,
        })
        thumbnailUrl?: string | null

    @Field(() => Int,
        {
            nullable: true,
        })
        duration?: number | null

    @Field(() => Boolean,
        {
            defaultValue: false,
        })
        isEditable: boolean

    @Field(() => Date)
        createdAt: Date

    @Field(() => Date)
        updatedAt: Date
}
