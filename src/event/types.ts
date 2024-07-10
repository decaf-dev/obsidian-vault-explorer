export type PluginEvent =
	| "file-rename"
	| "file-create"
	| "file-delete"
	| "file-modify"
	| "metadata-change"
	| "properties-filter-update"
	| "folder-rename"
	| "folder-delete"
	| "folder-create"
	| "page-size-setting-change"
	| "title-wrapping-setting-change"
	| "property-setting-change"
	| "device-registration-change"
	| "clock-updates-setting-change"
	| "filter-toggle-setting-change"
	| "scroll-buttons-setting-change"
	| "view-toggle-setting-change"
	| "file-icons-setting-change"
	| "filter-groups-wrapping-setting-change"
	| "load-social-media-image-setting-change";

export type EventCallback = (...data: unknown[]) => void;
