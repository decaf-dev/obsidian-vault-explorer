# Contribute to Vault Explorer

## Installation

Clone the repository

```shell
git clone https://github.com/decaf-dev/obsidian-dataloom.git
```

Install [Bun.sh](https://bun.sh/) for your operating system

Change directories to the clone repository

```shell
cd obsidian-vault-explorer
```

Install project dependencies

```shell
bun install
```

Build the project. This will create a `dist` folder

```shell
bun run build
```

Create a symbolic link from the `dist` folder to your Obsidan vault.

> [!TIP]  
> I recommend creating a new Obsidian vault just for development. This way, you won't accidentally modify any of your files.

```shell
ln -s <repository-path>/dist <development-vault-path>/.obsidian/plugins/vault-explorer-dev
```

For example

```shell
ln -s /users/decaf-dev/desktop/obsidian-vault-explorer/dist /users/decaf-dev/desktop/dev-vault/.obsidian/plugins/vault-explorer-dev
```

Open your Obsidian vault

Go to **Community plugins**

Find **Vault Explorer** and then enable the plugin by switching the toggle.

> [!NOTE]  
> You may need to click the **Reload plugins** button

## Development

Checkout the `dev` branch and make a child branch off of it.

```shell
git pull dev
```

```shell
git checkout dev
```

```shell
git checkout -b <your-branch-name>
```

> [!IMPORTANT]  
> Please make sure that you make a branch off of `dev` instead of `master`. This will help reduce merge conflicts by making sure that you have the latest code changes.

Run esbuild in development mode

```shell
bun run dev
```

Make some code changes

Restart Obsidian to see your code changes

### Pull requests

Once you have made your changes, push your code to GitHub and make a pull request.

Please choose `dev` as the branch you want to merge into.

The pull request will be reviewed. Once it is approved, it will be merged.
