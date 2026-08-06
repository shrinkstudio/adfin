# Adfin

TypeScript source is compiled with esbuild and served to the Webflow project.

Before starting to work with this project, please take some time to read through the documentation.

## Reference

- [Included tools](#included-tools)
- [Requirements](#requirements)
- [Getting started](#getting-started)
  - [Installing](#installing)
  - [Building](#building)
    - [Serving files on development mode](#serving-files-on-development-mode)
    - [Building multiple files](#building-multiple-files)
    - [Building CSS files](#building-css-files)
    - [Setting up a path alias](#setting-up-a-path-alias)
- [Testing](#testing)
- [Contributing guide](#contributing-guide)
- [Pre-defined scripts](#pre-defined-scripts)
- [CI/CD](#cicd)

## Included tools

This project contains some preconfigured development tools:

- [TypeScript](https://www.typescriptlang.org/): A superset of JavaScript that adds an additional layer of typings, bringing more security and efficiency to the written code.
- [Prettier](https://prettier.io/): Code formatting that assures consistency across the codebase.
- [ESLint](https://eslint.org/): Code linting that enforces industry best practices.
- [Playwright](https://playwright.dev/): Fast and reliable end-to-end testing.
- [esbuild](https://esbuild.github.io/): JavaScript bundler that compiles, bundles and minifies the original TypeScript files.
- [Changesets](https://github.com/changesets/changesets): A way to manage versioning and changelogs.

## Requirements

This project requires the use of [pnpm](https://pnpm.io/). You can [install pnpm](https://pnpm.io/installation) with:

```bash
npm i -g pnpm
```

## Getting started

### Installing

Open the repository in your terminal and install the packages by running:

```bash
pnpm install
```

If this is the first time using Playwright and you want to use it in this project, you'll also have to install the browsers by running:

```bash
pnpm playwright install
```

You can read more about the use of Playwright in the [Testing](#testing) section.

It is also recommended that you install the following extensions in your VSCode editor:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Building

To build the files, you have two defined scripts:

- `pnpm dev`: Builds and creates a local server that serves all files (check [Serving files on development mode](#serving-files-on-development-mode) for more info).
- `pnpm build`: Builds to the production directory (`dist`).

### Serving files on development mode

When you run `pnpm dev`, two things happen:

- esbuild is set to `watch` mode. Every time you save your files, the project will be rebuilt.
- A local server is created under `http://localhost:3000` that serves all your project files. You can import them in your Webflow project like:

```html
<script defer src="http://localhost:3000/{FILE_PATH}.js"></script>
```

- Live Reloading is enabled by default, meaning that every time you save a change in your files, the website you're working on will reload automatically. You can disable it in `/bin/build.js`.

### Building multiple files

If you need to build multiple files into different outputs, you can do it by updating the build settings.

In `bin/build.js`, update the `ENTRY_POINTS` array with any files you'd like to build:

```javascript
const ENTRY_POINTS = [
  'src/home/index.ts',
  'src/contact/whatever.ts',
  'src/hooyah.ts',
  'src/home/other.ts',
];
```

This will tell `esbuild` to build all those files and output them in the `dist` folder for production and in `http://localhost:3000` for development.

### Building CSS files

CSS files are also supported by the bundler. When including a CSS file as an entry point, the compiler will generate a minified version in your output folder.

You can define a CSS entry point by either:

- Manually defining it in the `bin/build.js` config. [See previous section](#building-multiple-files) for reference.
- Or importing the file inside any of your JavaScript / TypeScript files:

```typescript
// src/index.ts
import './index.css';
```

CSS outputs are also available in `localhost` during [development mode](#serving-files-on-development-mode).

### Setting up a path alias

Path aliases are very helpful to avoid code like:

```typescript
import example from '../../../../utils/example';
```

Instead, we can create path aliases that map to a specific folder, so the code becomes cleaner like:

```typescript
import example from '$utils/example';
```

You can set up path aliases using the `paths` setting in `tsconfig.json`. This project has an already predefined path as an example:

```json
{
  "paths": {
    "$utils/*": ["src/utils/*"]
  }
}
```

To avoid any surprises, take some time to familiarize yourself with the [tsconfig](/tsconfig.json) enabled flags.

## Testing

This project has [Playwright](https://playwright.dev/) included as an automated testing tool.

All tests are located under the `/tests` folder. The project includes a test spec example to help you catch up with Playwright.

After [installing the dependencies](#installing), you can try it out by running `pnpm test`.
Make sure you replace it with your own tests. Writing proper tests will help improve the maintainability and scalability of the project in the long term.

By default, Playwright will also run `pnpm dev` in the background while the tests are running, so [your files served](#serving-files-on-development-mode) under `localhost:3000` will run as usual.
You can disable this behavior in the `playwright.config.ts` file.

If your project doesn't require any testing, you should disable the Tests job in the [CI workflow](#cicd) by commenting it out in the `.github/workflows/ci.yml` file.
This will prevent the tests from running when you open a Pull Request.

## Contributing guide

In general, your development workflow should look like this:

1. Create a new branch to develop a new feature or bug fix.
2. Once you've finished the implementation, [create a Changeset](https://github.com/changesets/changesets) (or multiple) explaining the changes you've made in the codebase.
3. Open a Pull Request and wait until the CI workflows finish. If something fails, please try to fix it before merging the PR.
4. Merge the Pull Request. The Changesets bot will automatically open a new PR with updates to the `CHANGELOG.md`; you should also merge that one.

If you need to work on several features before publishing a new version, it is good practice to create a `development` branch to merge all the PRs into before pushing your code to `master`.

## Pre-defined scripts

This project contains a set of predefined scripts in the `package.json` file:

- `pnpm dev`: Builds and creates a local server that serves all files (check [Serving files on development mode](#serving-files-on-development-mode) for more info).
- `pnpm build`: Builds to the production directory (`dist`).
- `pnpm lint`: Scans the codebase with ESLint and Prettier to see if there are any errors.
- `pnpm lint:fix`: Fixes all auto-fixable issues in ESLint.
- `pnpm check`: Checks for TypeScript errors in the codebase.
- `pnpm format`: Formats all the files in the codebase using Prettier.
- `pnpm test`: Runs all the tests located in the `/tests` folder.
- `pnpm test:ui`: Runs all the tests located in the `/tests` folder visually in the Playwright UI.
- `pnpm release`: Defined for [Changesets](https://github.com/changesets/changesets). You don't have to interact with it.
- `pnpm run update`: Scans the dependencies of the project and provides an interactive UI to select the ones you want to update.

## CI/CD

When you open a Pull Request, a Continuous Integration workflow will run to:

- Lint & check your code. It uses the `pnpm lint` and `pnpm check` commands under the hood.
- Run the automated tests. It uses the `pnpm test` command under the hood.

If any of these jobs fail, you will get a warning in your Pull Request and should try to fix your code accordingly.

**Note:** If your project doesn't contain any defined tests in the `/tests` folder, you can skip the Tests workflow job by commenting it out in the `.github/workflows/ci.yml` file. This will significantly improve the workflow running times.
