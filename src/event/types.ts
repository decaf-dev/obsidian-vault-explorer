export enum PluginEvent {
	FILE_RENAME = "file-rename",
	FILE_CREATE = "file-create",
	FILE_DELETE = "file-delete",
	FILE_MODIFY = "file-modify",
	COLLAPSE_FILTERS_CHANGE = "collapse-filters-change",
	METADATA_CHANGE = "metadata-change",
	PROPERTIES_FILTER_UPDATE = "properties-filter-update",
	FOLDER_RENAME = "folder-rename",
	FOLDER_DELETE = "folder-delete",
	FOLDER_CREATE = "folder-create",
	PAGE_SIZE_SETTING_CHANGE = "page-size-setting-change",
	COVER_IMAGE_FIT_SETTING_CHANGE = "cover-image-fit-setting-change",
	FEED_CONTENT_SETTING_CHANGE = "feed-content-setting-change",
	COVER_IMAGE_SOURCE_SETTING_CHANGE = "cover-image-source-setting-change",
	PROPERTY_SETTING_CHANGE = "property-setting-change",
	LICENSE_KEY_VALIDATION_CHANGE = "license-key-validation-change",
	CLOCK_UPDATES_SETTING_CHANGE = "clock-updates-setting-change",
	FILTER_TOGGLE_SETTING_CHANGE = "filter-toggle-setting-change",
	SCROLL_BUTTONS_SETTING_CHANGE = "scroll-buttons-setting-change",
	VIEW_TOGGLE_SETTING_CHANGE = "view-toggle-setting-change",
	FILE_ICONS_SETTING_CHANGE = "file-icons-setting-change",
	LOAD_BODY_TAGS_SETTING_CHANGE = "load-body-tags-setting-change",
	LOAD_SOCIAL_MEDIA_IMAGE_SETTING_CHANGE = "load-social-media-image-setting-change",
	SHOW_TAGS_SETTING_CHANGE = "show-tags-setting-change",
}

export type EventCallback = (...data: unknown[]) => void;
