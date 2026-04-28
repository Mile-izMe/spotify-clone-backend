/**
 * Config map data.
 */
export interface ConfigMapData {
  /**
   * Indices.
   */
  indices: string;
}

/**
 * Config map.
 */
export type ConfigMap = Record<string, ConfigMapData>;

/**
 * Config map.
 */
export const configMap: ConfigMap = {
    Song: {
        indices: "songs",
    },
    User: {
        indices: "users",
    },
    Playlist: {
        indices: "playlists",
    },
}
