
# @rmtc/plugin

A base class to be extended by other @rmtc/toolchain plugins.

> [!TIP]<br/>
> This package forms part of [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme). You'll find further documentation in the main project README.

> [!CAUTION]<br/>
> This project is in early alpha, it's highly likely that we'll introduce accidental breaking changes.


## Table of Contents

  * [Table of Contents](#table-of-contents)
  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Override methods](#override-methods)
      * [`init` method](#init-method)
      * [`configure` method](#configure-method)
    * [Utilities](#utilities)
      * [`this.config`](#thisconfig)
      * [`this.projectDirectoryPath`](#thisprojectdirectorypath)
      * [`this.log`](#thislog)
      * [`this.availableWorkflows`](#thisavailableworkflows)
      * [`this.defineStep()`](#thisdefinestep)
      * [`this.defineWorkflow()`](#thisdefineworkflow)
      * [`this.exec()`](#thisexec)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+


## Usage

This module is intended to be installed as a dependency for @rmtc/toolchain plugins. For a plugin to load it'll need to extend the `Plugin` class.

Install the module with [npm](https://www.npmjs.com/):

```sh
npm install @rmtc/plugin
```

Now you can import the plugin and extend it. This is the minimal code for a plugin, but it doesn't do anything:

```js
const { Plugin } = require('@rmtc/plugin');

exports.Plugin = class Example extends Plugin {}
```

To make changes to the toolchain, you'll need to [override](#override-methods) certain methods in the class and [call others](#utilities).

### Override methods

There are several methods that a subclass of `Plugin` can override to make changes to the toolchain. We'll cover them here.

These methods alone don't make a plugin, you'll also need the [utility methods](#utilities) to complete a plugin.

#### `init` method

The `init` method is called automatically when a plugin is initialised and loaded into the toolchain via a config file. It's better to override this method rather than the `constructor` because it has a much simpler signature and you can guarantee that the plugin is fully set up.

Consider the `init` method to be where you define the workflows and steps for your plugin and get everything set up:

```js
exports.Plugin = class Example extends Plugin {
    init() {
        // Setup code goes here
    }
}
```

The method signature is very simple. It accepts no arguments and returns nothing:

```ts
() => void
```

#### `configure` method

The `configure` method is called _before_ `init` and is used to change, provide defaults for, or validate the configuration that a user has passed into your plugin.

The method is passed a config object and is expected to return one as well:

```ts
type ConfigObject = {[key: string]: any}
(config: ConfigObject) => ConfigObject
```

Here's an example of defaulting some configuration:

```js
exports.Plugin = class Example extends Plugin {
    configure(config) {
        return Object.assign({
            myConfiguration: 'default value'
        }, config);
    }
}
```

Here's an example of validating the configuration, also using the `ConfigError` class from [@rmtc/config](../config#readme):

```js
const {ConfigError} = require('@rmtc/config');

exports.Plugin = class Example extends Plugin {
    configure(config) {
        if (typeof config.myConfiguration !== 'string') {
            throw new ConfigError('The myConfiguration option must be a string');
        }

        // Don't forget to return the config still
        return config;
    }
}
```

### Utilities

The rest of the properties and methods on the `Plugin` class can be used as you see fit in your `init` and `configure` methods.

#### `this.config`

`{[key: string]: any}`. A read-only property that contains the plugin configuration found in the project's `.rmtc.json5` config file. It will also be the exact value you return from your [`configure` method](#configure-method) if you specify one.

#### `this.projectDirectoryPath`

`string`. A read-only property that contains the resolved directory path that the project is in. This can be used to make file system operations relative to the project that's running, e.g. reading a `package.json` file.

#### `this.log`

A [`Logger`](../logger#usage) instance that can be used to consistently output messages to the console. It's best to use this rather than `console.log`.

#### `this.availableWorkflows`

`string[]`. A read-only list of the workflows that have been defined by other plugins that were set up ahead of this one.

#### `this.defineStep()`

Used to define a step. If the step already exists then an error will be thrown, so it's best to name your steps in a way that won't conflict with other plugins. The method signature is:

```ts
type StepParams = {environment: "local" | "ci"}
type StepExecutor = (params: StepParams) => Promise<void>
(name: string, executor: StepExecutor) => void
```

When defining a step, you're giving it a name and a function to run when that step is executed as part of a workflow. This "executor" is an `async` function that can do anything you like. It's called with some parameters which, along with `this.config`, allows you to change your plugin's behaviour.

A simple step definition looks like this:

```js
exports.Plugin = class Example extends Plugin {
    init() {
        this.defineStep('myStep', async () => {
            this.log('my step happened');
        });
    }
}
```

But you can use the fact that a plugin is a class to help organise, defining your own methods to handle each step:

```js
exports.Plugin = class Example extends Plugin {
    init() {
        this.defineStep('myStep', this.myStep.bind(this));
    }
    async myStep() {
        this.log('my step happened');
    }
}
```

Steps can then be added to workflows (see below), or just left in place for users to add to their own workflows.

#### `this.defineWorkflow()`

Used to define a workflow. If the workflow already exists then it is not re-created, so it's safe to call this method multiple times. This is also useful for adding steps to shared generic workflows that other plugins may use (e.g. `build`, `verify`, `test`). The method signature is:

```ts
(name: string, defaultSteps?: string[]) => void
```

You may optionally specify some steps that should be added to this workflow by default. These steps do not override steps added to the workflow by other plugins.

This method is best used in the `init` method after steps have been defined:

```js
exports.Plugin = class Example extends Plugin {
    init() {
        this.defineStep('myStep', this.myStep.bind(this));
        this.defineWorkflow('test', ['myStep']);
    }
    async myStep() {
        this.log('my step happened');
    }
}
```

#### `this.exec()`

This is a shortcut method for executing Node.js-based commands within the context of the project. It's a wrapper around the built-in [child_process API](https://nodejs.org/api/child_process.html) that is more convenient to use in a plugin. The method signature is:

```ts
(command: string, args?: string[]) => Promise<void>
```

If the command that you're calling exits with a non-`0` code then an error will be thrown and execution will stop. All `stdout` from the command will be piped directly into the workflow output.

```js
exports.Plugin = class Example extends Plugin {
    init() {
        this.defineStep('myStep', this.myStep.bind(this));
        this.defineWorkflow('test', ['myStep']);
    }
    async myStep() {
        await this.exec('cowsay', ['my step happened']);
    }
}
```

It's important to note that all commands are prefixed with `npx`, the intention being that this works best with Node.js-based command line tools.


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
