# Obsidian Vault Explorer

![](/readme/cover.png)

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22vault-explorer%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)

Vault Explorer is an [Obsidian.md](https://obsidian.md) plugin for desktop only. It allows you to explore your vault in visual format.

This plugin is a replacement for some of the functionality found in [Obsidian DataLoom](https://github.com/trey-wallis/obsidian-dataloom).

## About

-   [Installation](#installation)
-   [Usage](#usage)
-   [Settings](#settings)

## Installation

1. Install the [Obsidian BRAT](https://obsidian.md/plugins?id=brat) plugin from Obsidian community plugin store
2. Enable the plugin
3. Open the plugin settings
4. Click **Add beta plugin**
5. Enter the repository url: **https://github.com/trey-wallis/obsidian-vault-explorer**
6. Click **Add plugin**

## Usage

Start by opening the vault explorer view by clicking on the compass icon on the left-hand sidebar.

The explorer vault is a read-only view for your vault. You may filter based on folders and property values.

There are also additional views by which you can view your vault files.

## Settings

The vault explorer has several built-in properties.

### URL

The url property will render a button in the grid view that will allow you to navigate to URL pages.

A url should be a valid url e.g. `https://google.com`

### Favorite

The favorite property will allow you to filter by favorites using the `Favorites` checkbox.

This property should be of checkbox type.

## Development

1. Clone the GitHub repository

```shell
git clone https://github.com/trey-wallis/obsidian-vault-explorer.git
```

2. Install [Bun](https://bun.sh)
3. Build the project `bun run build`
4. Add a symbolic link from the `dist` folder to your vault's plugin folder

```shell
ln -s <folder-path>/obsidian-vault-explorer/dist <vault-path>/.obsidian/plugins/vault-explorer
```

5. Enable the plugin
