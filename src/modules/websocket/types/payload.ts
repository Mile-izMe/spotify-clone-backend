/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WsBusPayload {
    event: string;    // Ex: 'songs.updated', 'user.banned', 'notify.new'
    recipients?: string[]; // List of userIds to receive the message (if empty, broadcast)
    data: any;        // Actual data
}