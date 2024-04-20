export type PluginEvent = "file-rename" | "file-create" | "file-delete" | "file-modify" | "metadata-change" | "properties-filter-update" | "folder-rename" | "folder-delete" | "folder-create";

export type EventCallback = (...data: unknown[]) => void;
