export function extractFileExtension(fileName?: string): string {
    if (!fileName?.includes(".")) {
        return ""
    }

    const extension = fileName.slice(fileName.lastIndexOf("."))
    return extension.length > 1
        ? extension
        : ""
}