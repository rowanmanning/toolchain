
# RMTC (Rowan Manning's Tool Chain)

This is a suite of build tools for Node.js projects, really intended to be used for my projects – I make no promises about supporting your use case.

This project was inspired by [FT.com Tool Kit](https://github.com/financial-Times/dotcom-tool-kit), a project we use to build Node.js projects at the Financial Times.

> [!CAUTION]<br/>
> This project is in early alpha, it's highly likely that we'll introduce accidental breaking changes.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Setting up](#setting-up)
    * [Configuration](#configuration)
      * [Plugins](#plugins)
        * [Extra plugin config](#extra-plugin-config)
      * [Workflows](#workflows)
    * [Running workflows](#running-workflows)
  * [Available plugins](#available-plugins)
  * [Writing plugins](#writing-plugins)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+


## Usage

@rmtc/toolchain is a lightweight task-runner that can be extended with [_**Plugins**_](#plugins). Plugins define _**Steps**_ that can be composed together into [_**Workflows**_](#workflows).

These workflows can be run by calling the task runner with one or more workflow names. We'll go into more detail after setting up:

### Setting up

You can automatically create a config file and install the task runner using:

```sh
npm create @rmtc/toolchain
```

If you'd rather do this manually then you can install the task runner with [npm](https://www.npmjs.com/) and create a minimal config file:

```sh
npm install --save-dev @rmtc/toolchain
echo "{ plugins: [], workflows: {} }" > .rmtc.json5
```

### Configuration

The task runner expects to find a file named `.rmtc.json5` in the current working directory. This file is used to define plugins and workflows. The minimal config file is:

```js
{
    plugins: [],
    workflows: {}
}
```

#### Plugins

Plugins are installed as npm modules but still need to be referenced in your config file. We'll use the [ESLint plugin](plugins/eslint#readme) as an example. First, we install it as a development dependency:

```sh
npm install --save-dev @rmtc/plugin-eslint
```

Then we update our config file to include the plugin:

```js
{
    plugins: [
        '@rmtc/plugin-eslint'
    ],
    workflows: {}
}
```

Plugins define _**Steps**_ and normally some default [_**Workflows**_](#workflows). A step is like a single discreet task that you want to run, and a workflow is a _list_ of steps to run in order.

The ESLint plugin defines a workflow named `verify` automatically, so we can already use it with:

```sh
npx toolchain verify
```

##### Extra plugin config

When you import a plugin you can also specify some configuration options if the plugin supports any. Sometimes this allows you to import the plugin multiple times to define different workflow steps. Instead of defining the plugin as a string, define it as an array with a config object:

```js
{
    plugins: [
        ['@rmtc/plugin-mocha', {
            coverage: true
        }]
    ],
    workflows: {}
}
```

In the example above, we're configuring the [Mocha plugin](plugins/mocha#readme) plugin to collect code coverage automatically.

#### Workflows

Workflows are lists of _**Steps**_ that your [_**Plugins**_](#plugins) have defined. Plugins often define default workflows but you can both define your own _and_ override existing workflows in your config file.

Workflows are defined as object properties, the key is the name of the workflow and the value is an array of steps to run:

```js
{
    plugins: [
        '@rmtc/plugin-eslint'
    ],
    workflows: {
        doTheLinting: [
            'eslint'
        ]
    }
}
```

Now, instead of using the `verify` workflow that was defined by the ESLint plugin, we can use our `doTheLinting` workflow:

```sh
npx toolchain doTheLinting
```

You can use this to create your own more complex workflows or remove plugin steps from other workflows that they appear in. E.g. we can disable the default `verify` workflow from ESLint with the following:

```js
{
    plugins: [
        '@rmtc/plugin-eslint'
    ],
    workflows: {
        verify: []
    }
}
```

If you want to know which steps are available to use in your workflows, you can find them with:

```sh
npx toolchain --list
```

### Running workflows

Once everything is configured, you can run any of the workflows that you defined yourself or were defined automatically by your plugins. To get a list of available workflows and steps run:

```sh
npx toolchain --list
```

You can run a workflow like this:

```sh
npx toolchain <workflow>
```

e.g.

```sh
npx toolchain test
```

You can also run multiple workflows in sequence, e.g.

```sh
npx toolchain verify test
```

## Available plugins

These are the official plugins which are published alongside the core library:

  * **[@rmtc/plugin-biome](plugins/biome#readme):** validates and formats JavaScript using [Biome](https://biomejs.dev/), with any config found in the project.

  * **[@rmtc/plugin-eslint](plugins/eslint#readme):** validates JavaScript using [ESLint](https://eslint.org/), with any config found in the project.

  * **[@rmtc/mocha](plugins/mocha#readme):** runs [Mocha](https://mochajs.org/) test suites.

  * **[@rmtc/plugin-npm-scripts](plugins/npm-scripts#readme):** creates `package.json` scripts for all defined workflows so that you can use `npm run <workflow>` instead of `npx toolchain <workflow>`.

  * **[@rmtc/plugin-types-in-jsdoc](plugins/types-in-jsdoc#readme):** validates [TypeScript](https://www.typescriptlang.org/) types across all JavaScript files in the project and generates type definition files. It expects a `jsconfig.json` file to exist in the project.


## Writing plugins

Plugins are node modules that can either be published to the npm registry or kept on a local file path if it's specific to the project you're working on. All of these are valid plugin definitions:

```js
{
    plugins: [
        '@yourname/my-plugin', // published to npm
        'my-plugin',           // published to npm
        './plugins/my-plugin'  // in a local file
    ],
    workflows: {}
}
```

For a module to be a valid plugin, it must export a class that extends the [@rmtc/plugin](packages/plugin#readme) `Plugin` class. This class must be exported as the `Plugin` export of the module:

```js
const { Plugin } = require('@rmtc/plugin');

exports.Plugin = class Example extends Plugin {
	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('my-step', () => {
            this.log.info('my plugin works');
        });
		this.defineWorkflow('my-workflow', ['my-step']);
	}
}
```

More information on extending the plugin class is available in the [@rmtc/plugin documentation](packages/plugin#readme).


## Contributing

[The contributing guide is available here](docs/contributing.md). All contributors must follow [this library's code of conduct](docs/code_of_conduct.md).


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
