import {
    Socket 
} from "socket.io"

export interface AuthenticatedSocket extends Socket {
    user: {
        userId: string
        deviceId: string
        roles: string[]
    }
}