> [!CAUTION]
> This template is **deprecated**. To get started with an Electron + TypeScript project, we highly recommend starting with [Electron Forge](https://www.electronforge.io/)'s official TypeScript templates.

# electron-quick-start-typescript

**Clone and run for a quick way to see Electron in action.**

This is a [TypeScript](https://www.typescriptlang.org) port of the [Electron Quick Start repo](https://github.com/electron/electron-quick-start) -- a minimal Electron application based on the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](http://electron.atom.io/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.ts` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start-typescript
# Go into the repository
cd electron-quick-start-typescript
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Re-compile automatically

To recompile automatically and to allow using [electron-reload](https://github.com/yan-foto/electron-reload), run this in a separate terminal:

```bash
npm run watch
```

根据提供的 package.json 文件，我们可以看到以下几个命令：

1. 构建命令：
   ```
   npm run build
   ```
   这个命令会编译 TypeScript 文件。

2. 监视文件变化并自动重新编译：
   ```
   npm run watch
   ```
   这个命令会持续监视 TypeScript 文件的变化，并在文件发生变化时自动重新编译。

3. 代码检查：
   ```
   npm run lint
   ```
   这个命令会使用 ESLint 对 src 目录下的 TypeScript 文件进行代码检查。

4. 启动应用：
   ```
   npm start
   ```
   这个命令会先构建项目，然后启动 Electron 应用。

对于开发、打包和运行，我们可以这样理解：

1. 开发命令：
   在开发过程中，你可能会同时运行这两个命令：
   ```
   npm run watch
   ```
   （在一个终端中运行，用于自动重新编译）
   ```
   npm start
   ```
   （在另一个终端中运行，用于启动应用）

2. 打包命令：
   这个 package.json 中没有明确的打包命令。通常，Electron 项目会使用 electron-builder 或 electron-packager 来打包。如果你需要打包功能，你可能需要添加类似这样的命令：
   ```json
   "scripts": {
     ...
     "pack": "electron-builder --dir",
     "dist": "electron-builder"
   }
   ```
   然后你可以使用 `npm run pack` 或 `npm run dist` 来打包应用。

3. 运行命令：
   ```
   npm start
   ```
   这个命令既可以用于开发时运行应用，也可以用于运行构建后的应用。

需要注意的是，这个项目模板主要focused于快速开始和开发。对于更复杂的开发流程和打包过程，你可能需要添加额外的工具和脚本。例如，你可能会想要添加 electron-reload 用于开发时的热重载，或者添加 electron-builder 用于应用打包。

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [Electron Fiddle](https://electronjs.org/fiddle) - create, play, and share small Electron experiments
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
