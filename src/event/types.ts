export type PluginEvent = "rename-file" | "create-file" | "delete-file" | "modify-file";

export type EventCallback = (...data: unknown[]) => void;
