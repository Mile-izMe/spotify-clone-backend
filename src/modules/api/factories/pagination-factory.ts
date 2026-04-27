import {
    Type 
} from "@nestjs/common"
import {
    Field, ObjectType 
} from "@nestjs/graphql"
import { 
    AbstractGraphQLResponse, 
    PaginationPageResponseData 
} from "@modules/api" 

/** 
 * Factory to create response data & response wrapper classes for paginated GraphQL queries.
 */
export function CreatePaginatedResponse<T>(classRef: Type<T>, resourceName: string) {
    
    /** 
     * Create class contains pagination info and data list
     */ 
    @ObjectType(`${resourceName}ResponseData`)
    abstract class ResponseData extends PaginationPageResponseData {
        @Field(() => [classRef],
            {
                description: `${resourceName} items for the current page.` 
            })
            data: T[]
    }

    /** 
     * Create the main Response Wrapper class that 
     * extends the AbstractGraphQLResponse and includes the ResponseData
     */ 
    @ObjectType(`${resourceName}Response`)
    abstract class ResponseWrapper extends AbstractGraphQLResponse {
        @Field(() => ResponseData,
            {
                description: `Payload containing ${resourceName} and count.` 
            })
            data: ResponseData
    }

    return {
        Data: ResponseData as Type<ResponseData>,
        Response: ResponseWrapper as Type<ResponseWrapper>,
    }
}