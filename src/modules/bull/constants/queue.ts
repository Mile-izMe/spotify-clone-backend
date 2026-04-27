import {
    BullQueueName
} from "../enums"
import type {
    BullQueueData
} from "../types"

/**
 * Wraps a string in braces for use as a Redis key prefix.
 *
 * @param prefix - Raw prefix string
 * @returns Formatted string like "{prefix}"
 */
export function formatWithBraces(prefix: string): string {
    return `{${prefix}}`
}

/**
 * Centralized configuration for all BullMQ queues.
 * Each queue has its own prefix and name derived from executor id.
 */
export const bullData: Record<BullQueueName, BullQueueData> = {
    [BullQueueName.ProcessMusic]: {
        prefix: formatWithBraces(
            "process-music"
        ),
        name: "process-music",
    },
}
