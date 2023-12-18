
# @rmtc/plugin-types-in-jsdoc

A [TypeScript](https://www.typescriptlang.org/)-in-JSDoc plugin for [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme). This checks types and builds type definitions based on `jsconfig.json`.

> [!CAUTION]<br/>
> This project is in early alpha, it's highly likely that we'll introduce accidental breaking changes.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Workflows](#workflows)
    * [Steps](#steps)
    * [Configuration](#configuration)
      * [`config.project`](#configproject)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+
  * [The @rmtc/toolchain CLI](https://github.com/rowanmanning/toolchain#readme)


## Usage

Install the module with [npm](https://www.npmjs.com/):

```sh
npm install --save-dev @rmtc/plugin-types-in-jsdoc
```

Include it in your `.rmtc.json` file:

```js
{
    plugins: [
        // ...
        '@rmtc/plugin-types-in-jsdoc'
    ]
    // ...
}
```

### Workflows

This plugin defines the following workflows:

  * **`verify`:** a general workflow used to verify code quality.

  * **`build`:** a general workflow used to generate code output and other compiled assets.

### Steps

This plugin defines the following steps that can be added to any workflow:

  * **`types-in-jsdoc:check-types`:** run the `tsc` command-line tool against a JavaScript project to check that it's type-safe, without emitting any type definitions. This expects a `jsconfig.json` file to live in the root of the project.

  * **`types-in-jsdoc:build-defs`:** run the `tsc` command-line tool against a JavaScript project to generate `.d.ts` files from any JSDoc found. This expects a `jsconfig.json` file to live in the root of the project.

### Configuration

Most of the configuration for this plugin should live within the `jsconfig.json` file. [See the TypeScript documentation for more information](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

#### `config.project`

`string`. Use this configuration to specify a different location than `jsconfig.json`, relative to the project directory. E.g.

```js
{
    plugins: [
        ['@rmtc/plugin-types-in-jsdoc', {
            project: 'config/types-in-jsdoc.json'
        }]
    ]
}
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
