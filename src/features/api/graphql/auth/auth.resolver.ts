import {
    Args,
    Mutation,
    Resolver
} from "@nestjs/graphql"
import {
    LoginRequest,
    LoginResponse,
    LoginService
} from "./mutations/login"
import {
    SongSaveMetadataRequest,
    SongSaveMetadataResponse,
    SongSaveMetadataService,
} from "./mutations/register"

@Resolver()
export class AuthResolver {
    constructor(
        private readonly loginService: LoginService,
        private readonly songSaveMetadataService: SongSaveMetadataService,
    ) { }

    /**
     * Login
     */
    @Mutation(
        () => LoginResponse,
        {
            name: "login",
            description: "Authenticate user with email and password, returning access and refresh tokens.",
        },
    )
    async login(
        @Args(
            "request",
            {
                description: "User credentials and device identifier.",
            },
        )
            request: LoginRequest,
    ): Promise<LoginResponse> {
        const data = await this.loginService.execute({
            request,
        })

        return {
            success: true,
            message: "Login successful",
            data,
        }
    }

    /**
     * Register
     */
    @Mutation(
        () => SongSaveMetadataResponse,
        {
            name: "songSaveMetadata",
            description: "Creates a song record from the uploaded file key and metadata.",
        },
    )
    async songSaveMetadata(
        @Args(
            "request",
            {
                description: "Request containing the uploaded key and song metadata.",
            },
        )
            request: SongSaveMetadataRequest,
    ): Promise<SongSaveMetadataResponse> {
        const data = await this.songSaveMetadataService.execute({
            request,
        })

        return {
            success: true,
            message: "Song metadata saved successfully",
            data,
        }
    }
}
