
# @rmtc/plugin-ignore-files

A plugin for [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme) that ensures `.gitignore` and `.npmignore` files have a core set of statements.

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
npm install --save-dev @rmtc/plugin-ignore-files
```

Include it in your `.rmtc.json` file:

```js
{
    plugins: [
        // ...
        '@rmtc/plugin-ignore-files'
    ]
    // ...
}
```

### Workflows

This plugin defines the following workflows:

  * **`postinstall`:** a general workflow used to indicate steps that should be run after dependencies have been installed.

### Steps

This plugin defines the following steps that can be added to any workflow:

  * **`ignore-files:install`:** add statements to the `.gitignore` file and `.npmignore` if either the package is non-private or it has workspaces defined.

### Configuration

This plugin provides no additional configuration.


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
