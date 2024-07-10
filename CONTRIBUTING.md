# Contribute to Vault Explorer

## Issues

Please open an [issue](https://github.com/decaf-dev/obsidian-vault-explorer/issues) for bugs or suggestions for improvement. All feedback is welcome.

## Pull requests

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### Project installation

Fork the Vault Explorer repository from GitHub

Install [Bun.sh](https://bun.sh/) for your operating system

Clone the forked repository

```shell
git clone https://github.com/<your-username>/obsidian-vault-explorer.git
```

Change directories to the repository on your machine

```shell
cd obsidian-vault-explorer
```

Install dependencies

```shell
bun install
```

Build the project. This will create a `dist` folder

```shell
bun run build
```

> [!TIP]  
> I recommend creating a new Obsidian vault just for development. This way, you won't accidentally modify any of your files.

Create a symbolic link from the `dist` folder to your Obsidan vault.

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
> You may need to click the **Reload plugins** button for the plugin to appear in the list

### Development

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

Restart your Obsidian application to see your code changes in action

### Open a pull request

Once you have commited your changes, push your code to GitHub and open a pull request.

Please choose your branch and `dev` as the branch you want to merge into.

Your pull request will be reviewed. Once it is approved, it will be merged.
