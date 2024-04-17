export type PluginEvent = "rename-file" | "create-file" | "delete-file" | "modify-file" | "metadata-change";

export type EventCallback = (...data: unknown[]) => void;
