/*
 * Generated type guards for "index.ts".
 * WARNING: Do not manually change this file.
 */
import { FilterRuleType, TextFilterCondition, NumberFilterCondition, DateFilterCondition, CheckboxFilterCondition, ListFilterCondition, ContentFilterCondition, FolderFilterCondition, FileNameFilterCondition, PropertyType, TExplorerView, VaultExplorerPluginSettings } from "./index";

export function isVaultExplorerPluginSettings(obj: unknown): obj is VaultExplorerPluginSettings {
    const typedObj = obj as VaultExplorerPluginSettings
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typedObj["properties"] !== null &&
            typeof typedObj["properties"] === "object" ||
            typeof typedObj["properties"] === "function") &&
        typeof typedObj["properties"]["favorite"] === "string" &&
        typeof typedObj["properties"]["url"] === "string" &&
        typeof typedObj["properties"]["image"] === "string" &&
        typeof typedObj["properties"]["createdDate"] === "string" &&
        typeof typedObj["properties"]["modifiedDate"] === "string" &&
        typeof typedObj["properties"]["custom1"] === "string" &&
        typeof typedObj["properties"]["custom2"] === "string" &&
        typeof typedObj["properties"]["custom3"] === "string" &&
        (typedObj["filters"] !== null &&
            typeof typedObj["filters"] === "object" ||
            typeof typedObj["filters"] === "function") &&
        (typedObj["filters"]["search"] !== null &&
            typeof typedObj["filters"]["search"] === "object" ||
            typeof typedObj["filters"]["search"] === "function") &&
        typeof typedObj["filters"]["search"]["isEnabled"] === "boolean" &&
        typeof typedObj["filters"]["search"]["value"] === "string" &&
        (typedObj["filters"]["favorites"] !== null &&
            typeof typedObj["filters"]["favorites"] === "object" ||
            typeof typedObj["filters"]["favorites"] === "function") &&
        typeof typedObj["filters"]["favorites"]["isEnabled"] === "boolean" &&
        typeof typedObj["filters"]["favorites"]["value"] === "boolean" &&
        (typedObj["filters"]["sort"] !== null &&
            typeof typedObj["filters"]["sort"] === "object" ||
            typeof typedObj["filters"]["sort"] === "function") &&
        typeof typedObj["filters"]["sort"]["isEnabled"] === "boolean" &&
        (typedObj["filters"]["sort"]["value"] === "file-name-asc" ||
            typedObj["filters"]["sort"]["value"] === "file-name-desc" ||
            typedObj["filters"]["sort"]["value"] === "modified-asc" ||
            typedObj["filters"]["sort"]["value"] === "modified-desc" ||
            typedObj["filters"]["sort"]["value"] === "random") &&
        (typedObj["filters"]["timestamp"] !== null &&
            typeof typedObj["filters"]["timestamp"] === "object" ||
            typeof typedObj["filters"]["timestamp"] === "function") &&
        typeof typedObj["filters"]["timestamp"]["isEnabled"] === "boolean" &&
        (typedObj["filters"]["timestamp"]["value"] === "created-today" ||
            typedObj["filters"]["timestamp"]["value"] === "modified-today" ||
            typedObj["filters"]["timestamp"]["value"] === "created-this-week" ||
            typedObj["filters"]["timestamp"]["value"] === "modified-this-week" ||
            typedObj["filters"]["timestamp"]["value"] === "created-2-weeks" ||
            typedObj["filters"]["timestamp"]["value"] === "modified-2-weeks" ||
            typedObj["filters"]["timestamp"]["value"] === "all") &&
        (typedObj["filters"]["custom"] !== null &&
            typeof typedObj["filters"]["custom"] === "object" ||
            typeof typedObj["filters"]["custom"] === "function") &&
        typeof typedObj["filters"]["custom"]["isEnabled"] === "boolean" &&
        typeof typedObj["filters"]["custom"]["selectedGroupId"] === "string" &&
        Array.isArray(typedObj["filters"]["custom"]["groups"]) &&
        typedObj["filters"]["custom"]["groups"].every((e: any) =>
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            typeof e["id"] === "string" &&
            typeof e["name"] === "string" &&
            Array.isArray(e["rules"]) &&
            e["rules"].every((e: any) =>
            ((e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
                typeof e["id"] === "string" &&
                (e["operator"] === "and" ||
                    e["operator"] === "or") &&
                (e["type"] === FilterRuleType.PROPERTY ||
                    e["type"] === FilterRuleType.FOLDER ||
                    e["type"] === FilterRuleType.FILE_NAME ||
                    e["type"] === FilterRuleType.CONTENT) &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY ||
                    e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) &&
                typeof e["isEnabled"] === "boolean" &&
                typeof e["value"] === "string" &&
                typeof e["matchWhenPropertyDNE"] === "boolean" &&
                e["type"] === FilterRuleType.PROPERTY &&
                e["propertyType"] === PropertyType.TEXT &&
                typeof e["propertyName"] === "string" &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST) ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                typeof e["id"] === "string" &&
                (e["operator"] === "and" ||
                    e["operator"] === "or") &&
                (e["type"] === FilterRuleType.PROPERTY ||
                    e["type"] === FilterRuleType.FOLDER ||
                    e["type"] === FilterRuleType.FILE_NAME ||
                    e["type"] === FilterRuleType.CONTENT) &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY ||
                    e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) &&
                typeof e["isEnabled"] === "boolean" &&
                typeof e["value"] === "string" &&
                typeof e["matchWhenPropertyDNE"] === "boolean" &&
                e["type"] === FilterRuleType.PROPERTY &&
                e["propertyType"] === PropertyType.NUMBER &&
                typeof e["propertyName"] === "string" &&
                (e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST) ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                typeof e["id"] === "string" &&
                (e["operator"] === "and" ||
                    e["operator"] === "or") &&
                (e["type"] === FilterRuleType.PROPERTY ||
                    e["type"] === FilterRuleType.FOLDER ||
                    e["type"] === FilterRuleType.FILE_NAME ||
                    e["type"] === FilterRuleType.CONTENT) &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY ||
                    e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) &&
                typeof e["isEnabled"] === "boolean" &&
                typeof e["value"] === "string" &&
                typeof e["matchWhenPropertyDNE"] === "boolean" &&
                e["type"] === FilterRuleType.PROPERTY &&
                e["propertyType"] === PropertyType.LIST &&
                typeof e["propertyName"] === "string" &&
                (e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST) ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                typeof e["id"] === "string" &&
                (e["operator"] === "and" ||
                    e["operator"] === "or") &&
                (e["type"] === FilterRuleType.PROPERTY ||
                    e["type"] === FilterRuleType.FOLDER ||
                    e["type"] === FilterRuleType.FILE_NAME ||
                    e["type"] === FilterRuleType.CONTENT) &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY ||
                    e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) &&
                typeof e["isEnabled"] === "boolean" &&
                typeof e["value"] === "string" &&
                typeof e["matchWhenPropertyDNE"] === "boolean" &&
                e["type"] === FilterRuleType.PROPERTY &&
                e["propertyType"] === PropertyType.CHECKBOX &&
                typeof e["propertyName"] === "string" &&
                (e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST) ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                typeof e["id"] === "string" &&
                (e["operator"] === "and" ||
                    e["operator"] === "or") &&
                (e["type"] === FilterRuleType.PROPERTY ||
                    e["type"] === FilterRuleType.FOLDER ||
                    e["type"] === FilterRuleType.FILE_NAME ||
                    e["type"] === FilterRuleType.CONTENT) &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY ||
                    e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) &&
                typeof e["isEnabled"] === "boolean" &&
                typeof e["value"] === "string" &&
                typeof e["matchWhenPropertyDNE"] === "boolean" &&
                e["type"] === FilterRuleType.PROPERTY &&
                (e["propertyType"] === PropertyType.DATE ||
                    e["propertyType"] === PropertyType.DATETIME) &&
                typeof e["propertyName"] === "string" &&
                (e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST) &&
                typeof e["valueData"] === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                typeof e["id"] === "string" &&
                (e["operator"] === "and" ||
                    e["operator"] === "or") &&
                (e["type"] === FilterRuleType.PROPERTY ||
                    e["type"] === FilterRuleType.FOLDER ||
                    e["type"] === FilterRuleType.FILE_NAME ||
                    e["type"] === FilterRuleType.CONTENT) &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY ||
                    e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) &&
                typeof e["isEnabled"] === "boolean" &&
                typeof e["value"] === "string" &&
                typeof e["matchWhenPropertyDNE"] === "boolean" &&
                e["type"] === FilterRuleType.FOLDER &&
                (e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT) &&
                typeof e["includeSubfolders"] === "boolean" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                typeof e["id"] === "string" &&
                (e["operator"] === "and" ||
                    e["operator"] === "or") &&
                (e["type"] === FilterRuleType.PROPERTY ||
                    e["type"] === FilterRuleType.FOLDER ||
                    e["type"] === FilterRuleType.FILE_NAME ||
                    e["type"] === FilterRuleType.CONTENT) &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY ||
                    e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) &&
                typeof e["isEnabled"] === "boolean" &&
                typeof e["value"] === "string" &&
                typeof e["matchWhenPropertyDNE"] === "boolean" &&
                e["type"] === FilterRuleType.FILE_NAME &&
                (e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                typeof e["id"] === "string" &&
                (e["operator"] === "and" ||
                    e["operator"] === "or") &&
                (e["type"] === FilterRuleType.PROPERTY ||
                    e["type"] === FilterRuleType.FOLDER ||
                    e["type"] === FilterRuleType.FILE_NAME ||
                    e["type"] === FilterRuleType.CONTENT) &&
                (e["condition"] === TextFilterCondition.IS ||
                    e["condition"] === TextFilterCondition.IS_NOT ||
                    e["condition"] === TextFilterCondition.CONTAINS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === TextFilterCondition.STARTS_WITH ||
                    e["condition"] === TextFilterCondition.ENDS_WITH ||
                    e["condition"] === TextFilterCondition.EXISTS ||
                    e["condition"] === TextFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === NumberFilterCondition.IS_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_NOT_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_GREATER ||
                    e["condition"] === NumberFilterCondition.IS_LESS ||
                    e["condition"] === NumberFilterCondition.IS_GREATER_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.IS_LESS_OR_EQUAL ||
                    e["condition"] === NumberFilterCondition.EXISTS ||
                    e["condition"] === NumberFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === DateFilterCondition.IS ||
                    e["condition"] === DateFilterCondition.IS_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_AFTER ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_BEFORE ||
                    e["condition"] === DateFilterCondition.IS_ON_OR_AFTER ||
                    e["condition"] === DateFilterCondition.EXISTS ||
                    e["condition"] === DateFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === CheckboxFilterCondition.IS ||
                    e["condition"] === CheckboxFilterCondition.IS_NOT ||
                    e["condition"] === CheckboxFilterCondition.EXISTS ||
                    e["condition"] === CheckboxFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ListFilterCondition.CONTAINS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ListFilterCondition.EXISTS ||
                    e["condition"] === ListFilterCondition.DOES_NOT_EXIST ||
                    e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY ||
                    e["condition"] === FolderFilterCondition.IS ||
                    e["condition"] === FolderFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.IS ||
                    e["condition"] === FileNameFilterCondition.IS_NOT ||
                    e["condition"] === FileNameFilterCondition.CONTAINS ||
                    e["condition"] === FileNameFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === FileNameFilterCondition.STARTS_WITH ||
                    e["condition"] === FileNameFilterCondition.ENDS_WITH) &&
                typeof e["isEnabled"] === "boolean" &&
                typeof e["value"] === "string" &&
                typeof e["matchWhenPropertyDNE"] === "boolean" &&
                e["type"] === FilterRuleType.CONTENT &&
                (e["condition"] === ContentFilterCondition.CONTAINS ||
                    e["condition"] === ContentFilterCondition.DOES_NOT_CONTAIN ||
                    e["condition"] === ContentFilterCondition.IS_EMPTY ||
                    e["condition"] === ContentFilterCondition.IS_NOT_EMPTY))
            ) &&
            typeof e["isEnabled"] === "boolean" &&
            typeof e["isSticky"] === "boolean"
        ) &&
        (typedObj["views"] !== null &&
            typeof typedObj["views"] === "object" ||
            typeof typedObj["views"] === "function") &&
        (typedObj["views"]["dashboard"] !== null &&
            typeof typedObj["views"]["dashboard"] === "object" ||
            typeof typedObj["views"]["dashboard"] === "function") &&
        typeof typedObj["views"]["dashboard"]["isEnabled"] === "boolean" &&
        (typedObj["views"]["grid"] !== null &&
            typeof typedObj["views"]["grid"] === "object" ||
            typeof typedObj["views"]["grid"] === "function") &&
        typeof typedObj["views"]["grid"]["isEnabled"] === "boolean" &&
        Array.isArray(typedObj["views"]["grid"]["coverImageSources"]) &&
        typedObj["views"]["grid"]["coverImageSources"].every((e: any) =>
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (e["type"] === "image-property" ||
                e["type"] === "url-property" ||
                e["type"] === "frontmatter" ||
                e["type"] === "body") &&
            typeof e["isEnabled"] === "boolean"
        ) &&
        (typedObj["views"]["grid"]["coverImageFit"] === "cover" ||
            typedObj["views"]["grid"]["coverImageFit"] === "contain" ||
            typedObj["views"]["grid"]["coverImageFit"] === "scale-down" ||
            typedObj["views"]["grid"]["coverImageFit"] === "none") &&
        typeof typedObj["views"]["grid"]["loadSocialMediaImage"] === "boolean" &&
        (typedObj["views"]["list"] !== null &&
            typeof typedObj["views"]["list"] === "object" ||
            typeof typedObj["views"]["list"] === "function") &&
        typeof typedObj["views"]["list"]["isEnabled"] === "boolean" &&
        typeof typedObj["views"]["list"]["showTags"] === "boolean" &&
        (typedObj["views"]["table"] !== null &&
            typeof typedObj["views"]["table"] === "object" ||
            typeof typedObj["views"]["table"] === "function") &&
        typeof typedObj["views"]["table"]["isEnabled"] === "boolean" &&
        (typedObj["views"]["feed"] !== null &&
            typeof typedObj["views"]["feed"] === "object" ||
            typeof typedObj["views"]["feed"] === "function") &&
        typeof typedObj["views"]["feed"]["isEnabled"] === "boolean" &&
        (typedObj["views"]["feed"]["collapseStyle"] === "no-new-lines" ||
            typedObj["views"]["feed"]["collapseStyle"] === "no-extra-new-lines") &&
        typeof typedObj["views"]["feed"]["removeH1"] === "boolean" &&
        typeof typedObj["views"]["feed"]["lineClampSmall"] === "number" &&
        typeof typedObj["views"]["feed"]["lineClampMedium"] === "number" &&
        typeof typedObj["views"]["feed"]["lineClampLarge"] === "number" &&
        (typedObj["views"]["recommended"] !== null &&
            typeof typedObj["views"]["recommended"] === "object" ||
            typeof typedObj["views"]["recommended"] === "function") &&
        typeof typedObj["views"]["recommended"]["isEnabled"] === "boolean" &&
        (typedObj["views"]["related"] !== null &&
            typeof typedObj["views"]["related"] === "object" ||
            typeof typedObj["views"]["related"] === "function") &&
        typeof typedObj["views"]["related"]["isEnabled"] === "boolean" &&
        (typedObj["titleWrapping"] === "normal" ||
            typedObj["titleWrapping"] === "break-word") &&
        typeof typedObj["enableClockUpdates"] === "boolean" &&
        typeof typedObj["enableFileIcons"] === "boolean" &&
        typeof typedObj["loadBodyTags"] === "boolean" &&
        (typedObj["currentView"] === null ||
            typedObj["currentView"] === TExplorerView.DASHBOARD ||
            typedObj["currentView"] === TExplorerView.GRID ||
            typedObj["currentView"] === TExplorerView.LIST ||
            typedObj["currentView"] === TExplorerView.FEED ||
            typedObj["currentView"] === TExplorerView.TABLE ||
            typedObj["currentView"] === TExplorerView.RECOMMENDED ||
            typedObj["currentView"] === TExplorerView.RELATED) &&
        typeof typedObj["pageSize"] === "number" &&
        typeof typedObj["filterGroupsWidth"] === "string" &&
        typeof typedObj["shouldWrapFilterGroups"] === "boolean" &&
        typeof typedObj["shouldCollapseFilters"] === "boolean" &&
        Array.isArray(typedObj["viewOrder"]) &&
        typedObj["viewOrder"].every((e: any) =>
        (e === TExplorerView.DASHBOARD ||
            e === TExplorerView.GRID ||
            e === TExplorerView.LIST ||
            e === TExplorerView.FEED ||
            e === TExplorerView.TABLE ||
            e === TExplorerView.RECOMMENDED ||
            e === TExplorerView.RELATED)
        ) &&
        typeof typedObj["configDir"] === "string" &&
        (typedObj["pluginVersion"] === null ||
            typeof typedObj["pluginVersion"] === "string") &&
        typeof typedObj["logLevel"] === "string"
    )
}
