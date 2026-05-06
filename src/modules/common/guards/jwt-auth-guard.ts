/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Injectable, UnauthorizedException 
} from "@nestjs/common"
import {
    AuthGuard 
} from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException("Your session has expired. Please log in again.")
        }
        return user
    }
}