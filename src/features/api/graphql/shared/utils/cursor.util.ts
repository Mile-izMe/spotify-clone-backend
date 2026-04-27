export function encodeCursor(value: string): string {
    return Buffer.from(value,
        "utf8").toString("base64")
}

export function decodeCursor(cursor?: string): string | undefined {
    if (!cursor?.trim()) {
        return undefined
    }

    try {
        return Buffer.from(cursor,
            "base64").toString("utf8")
    } catch {
        return cursor
    }
}
