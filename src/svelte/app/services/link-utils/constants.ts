//Matches [[file]] or [[file|text]]
export const WIKI_LINK_REGEX = /\[\[([^\|\]]+)(\|([^\]]+))?\]\]/;

//Matches ![[file]] or ![[file|text]]
export const INTERNAL_EMBED_REGEX = /!\[\[([^\|\]]+)(\|([^\]]+))?\]\]/;

//Matches ![](https://example.com/file) or ![text](https://example.com/file)
export const EXTERNAL_EMBED_REGEX = /!\[(.*?)\]\((https?:\/\/[^\s)]+)\)/;

//Matches https://example.com/file.jpg
export const URL_REGEX = /^https:\/\/[^\s]+$/;
