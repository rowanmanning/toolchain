
# @rmtc/plugin-npm-scripts

A plugin for [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme) that creates `package.json` scripts for all defined workflows.

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
npm install --save-dev @rmtc/plugin-npm-scripts
```

Include it in your `.rmtc.json` file:

```js
{
    plugins: [
        // ...
        '@rmtc/plugin-npm-scripts'
    ]
    // ...
}
```

### Workflows

This plugin defines the following workflows:

  * **`postinstall`:** a general workflow used to indicate steps that should be run after dependencies have been installed.

### Steps

This plugin defines the following steps that can be added to any workflow:

  * **`npm-scripts:install`:** override the `scripts` in the project's `package.json` file, ensuring that there's a script matching each defined workflow. This is a destructive action and will make changes to your files, but it makes running scripts more convenient. E.g.

    If you have a `test` workflow defined by one of your plugins, then this script will add a `scripts.test` property to `package.json` that runs `npx @rmtc/toolchain test`. You can now run tests with a regular `npm test`.

    When running this workflow for the first time it will output the original values of these scripts in case something was broken.

### Configuration

This plugin provides no additional configuration.


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
