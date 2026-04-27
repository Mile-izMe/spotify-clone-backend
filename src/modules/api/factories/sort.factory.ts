import {
    Field, InputType 
} from "@nestjs/graphql"
import {
    SortOrder 
} from "../apollo"


export function CreateSortInput<T>(enumRef: object, resourceName: string) {
  @InputType(`${resourceName}SortInput`)
    abstract class SortInput {
    @Field(() => enumRef)
        by: T

    @Field(() => SortOrder,
        {
            defaultValue: SortOrder.Desc 
        })
        order: SortOrder
  }
  return SortInput
}