# Contribute to Vault Explorer

Thank you for considering contributing to Vault Explorer!

## Testing

If you find a bug, please open an issue for it. If there's functionality that is annoying or you think that the UI can be improved, please open an issue for that as well. All feedback goes into making the plugin better.

## Features

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

If you're completely new to contributing to open source projects, please reference this guide:

https://www.freecodecamp.org/news/how-to-contribute-to-open-source-projects-beginners-guide/

### Installation

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
> You may need to click the **Reload plugins** button for the plugin to appear

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

Restart Obsidian to test your code changes

### Pull requests

Now add and commit your code changes

```shell
git add *
```

```git shell
git commit -m "<message here>"
```

Once you have made your changes, push your code to GitHub.

```shell
git push origin <your-branch>
```

Using GitHub, open a pull request.

Click on the **Pull requests** tab

Then click **New pull request**

Please choose your branch and `dev` as the branch you want to merge into.

Your pull request will be reviewed. Once it is approved, it will be merged into `dev`.
