export type PluginEvent = "rename-file" | "create-file" | "delete-file" | "modify-file" | "metadata-change" | "properties-filter-update";

export type EventCallback = (...data: unknown[]) => void;
