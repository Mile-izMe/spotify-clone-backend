import {
    S3Provider 
} from "../enums"

export interface ReadObjectParams {
    /** The S3 provider to use for this operation. */
    key: string
    /** The S3 provider to use for this operation. */
    provider: S3Provider
}

export interface ListParams {
    /** The key of the object to list. */
    key: string
    /** The provider to use for listing. */
    provider: S3Provider
}