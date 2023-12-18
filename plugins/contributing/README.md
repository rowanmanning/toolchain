
# @rmtc/plugin-contributing

A plugin for [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme) that syncs contributing and code of conduct documents to ensure they're consistent across projects.

> [!CAUTION]<br/>
> This project is in early alpha, it's highly likely that we'll introduce accidental breaking changes.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Workflows](#workflows)
    * [Steps](#steps)
    * [Configuration](#configuration)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+
  * [The @rmtc/toolchain CLI](https://github.com/rowanmanning/toolchain#readme)


## Usage

Install the module with [npm](https://www.npmjs.com/):

```sh
npm install --save-dev @rmtc/plugin-contributing
```

Include it in your `.rmtc.json` file:

```js
{
    plugins: [
        // ...
        '@rmtc/plugin-contributing'
    ]
    // ...
}
```

### Workflows

This plugin defines the following workflows:

  * **`postinstall`:** a general workflow used to indicate steps that should be run after dependencies have been installed.

### Steps

This plugin defines the following steps that can be added to any workflow:

  * **`contributing:install`:** override the `docs/contributing.md` and `docs/code_of_conduct.md` files in the project folder, ensuring that they're consistent.

### Configuration

#### `config.techSections`

`string[]`. Use this configuration to add additional sections to the end of the contributing guide which may not apply to all projects. The following sections are available: `conventional-commits`, `linting`, `testing`, and `types-in-jsdoc`. E.g.

```js
{
    plugins: [
        ['@rmtc/plugin-contributing', {
            techSections: [
                'conventional-commits',
                'linting',
                'types-in-jsdoc',
                'testing'
            ]
        }]
    ]
}
```

The ordering of these sections will be matched in the generated document.


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
