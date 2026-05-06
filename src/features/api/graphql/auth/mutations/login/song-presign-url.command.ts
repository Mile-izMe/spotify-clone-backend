import {
    SongPresignUrlRequest 
} from "./types"


export interface SongPresignUrlParams {
	request: SongPresignUrlRequest
}

export class SongPresignUrlCommand {
    constructor(
		readonly params: SongPresignUrlParams,
    ) {}
}
