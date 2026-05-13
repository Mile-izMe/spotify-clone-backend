import {
    estypes 
} from "@elastic/elasticsearch"

/**
 * Config map data.
 */
export interface ConfigMapData {
  /**
   * Indices.
   */
  indices: string;

  /**
   * Search fields.
   */
  searchFields?: string[];

  /**   
   * Mappings.
   */
  mappings: estypes.MappingTypeMapping
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
        searchFields: ["title^3",
            "artist^1"],
        mappings: {
            properties: {
                title: {
                    type: "text", analyzer: "vi_analyzer" 
                },
                artist: {
                    type: "text", analyzer: "vi_analyzer" 
                }
            }
        }
    },
    User: {
        indices: "users",
        searchFields: ["username^2"],
        mappings: {
            properties: {
                username: {
                    type: "text", analyzer: "vi_analyzer" 
                }
            }
        }
    },
    Playlist: {
        indices: "playlists",
        searchFields: ["name^2"],
        mappings: {
            properties: {
                name: {
                    type: "text", analyzer: "vi_analyzer" 
                }
            }
        }
    },
}
