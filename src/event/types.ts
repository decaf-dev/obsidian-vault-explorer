export type PluginEvent = "file-rename" | "file-create" | "file-delete" | "file-modify" | "metadata-change" | "properties-filter-update" | "folder-rename" | "folder-delete" | "folder-create" | "page-size-setting-change" | "title-wrapping-setting-change" | "property-setting-change";

export type EventCallback = (...data: unknown[]) => void;
