
# @rmtc/plugin-mocha

A [Mocha](https://mochajs.org/) test running plugin for [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme).

> [!CAUTION]<br/>
> This project is in early alpha, it's highly likely that we'll introduce accidental breaking changes.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Workflows](#workflows)
    * [Steps](#steps)
    * [Configuration](#configuration)
      * [`config.type`](#configtype)
      * [`config.coverage`](#configcoverage)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+
  * [The @rmtc/toolchain CLI](https://github.com/rowanmanning/toolchain#readme)


## Usage

Install the module with [npm](https://www.npmjs.com/):

```sh
npm install --save-dev @rmtc/plugin-mocha
```

Include it in your `.rmtc.json` file:

```js
{
    plugins: [
        // ...
        '@rmtc/plugin-mocha'
    ]
    // ...
}
```

### Workflows

This plugin defines the following workflows:

  * **`test`:** a general workflow used to run all automated tests.

  * **`test:<type>`:** optionally (see [`config.type`](#configtype)) more specific workflows for different types of automated tests.

### Steps

This plugin defines the following steps that can be added to any workflow:

  * **`mocha`:** optionally (see [`config.type`](#configtype)) a general step used to run any tests found in the project. This uses the following pattern to find test files:

    1. Look in all folders matching `**/test/**`
    2. Run tests in files that end in `.spec.{js,cjs,mjs}`

  * **`mocha:<type>`:** optionally (see [`config.type`](#configtype)) a step used to run tests of a specific type found in the project. This uses the following pattern to find test files:

    1. Look in all folders matching `**/test/<type>/**`
    2. Run tests in files that end in `.spec.{js,cjs,mjs}`

### Configuration

Most of the configuration for this plugin should live within the Mocha configuration file or `package.json`. [See the Mocha documentation for more information](https://mochajs.org/#configuring-mocha-nodejs).

#### `config.type`

`string`. Use this configuration to specify a different location to look for tests in, which in turn will define additional workflows and steps. E.g.

```js
{
    plugins: [
        ['@rmtc/plugin-mocha', {
            type: 'unit'
        }]
    ]
}
```

The above will define two workflows (`test` and `test:unit`). It will define one step (`mocha:unit`), which will run tests inside `**/test/unit/**` folders in the project. The `test` workflow also runs the `mocha:unit` step.

Because the workflows and steps change, it's possible to add multiple different mocha plugin configurations this way, e.g.

```js
{
    plugins: [
        ['@rmtc/plugin-mocha', {
            type: 'unit'
        }],
        ['@rmtc/plugin-mocha', {
            type: 'end-to-end'
        }]
    ]
}
```

The above will define three workflows (`test`, `test:unit`, and `test:end-to-end`). It will define two steps (`mocha:unit` and `mocha:end-to-end`), which will run tests inside their respective directories. The `test` workflow runs both the `mocha:unit` and `mocha:end-to-end` steps for convenience.

#### `config.coverage`

`boolean`. Whether to collect code coverage for the tests using [Istanbul](https://istanbul.js.org/). If this is set to `true` then coverage will be collected and reported based on how you've [configured `nyc`](https://www.npmjs.com/package/nyc#configuration-files).

This configuration is useful when combined with [`type`](#configtype) because you could report coverage only based on unit tests and not allow the end-to-end tests to impact this. E.g.

```js
{
    plugins: [
        ['@rmtc/plugin-mocha', {
            type: 'unit',
            coverage: true
        }],
        ['@rmtc/plugin-mocha', {
            type: 'end-to-end'
        }]
    ]
}
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
