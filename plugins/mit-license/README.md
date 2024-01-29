
# @rmtc/plugin-mit-license

A plugin for [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme) that ensures a project has a valid MIT license file and entry in `package.json`.

> [!WARNING]<br/>
> This project is intended for use in [@rowanmanning](https://github.com/rowanmanning/)'s projects. It's free to use but I don't offer support for use-cases outside of what I need.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Workflows](#workflows)
    * [Steps](#steps)
    * [Configuration](#configuration)
      * [`config.holders`](#configholders)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+
  * [The @rmtc/toolchain CLI](https://github.com/rowanmanning/toolchain#readme)


## Usage

Install the module with [npm](https://www.npmjs.com/):

```sh
npm install --save-dev @rmtc/plugin-mit-license
```

Include it in your `.rmtc.json` file:

```js
{
    plugins: [
        // ...
        '@rmtc/plugin-mit-license'
    ]
    // ...
}
```

### Workflows

This plugin defines the following workflows:

  * **`postinstall`:** a general workflow used to indicate steps that should be run after dependencies have been installed.

### Steps

This plugin defines the following steps that can be added to any workflow:

  * **`mit-license:install`:** override the `LICENSE` file in the project folder as well as `package.json` `license` property ensuring that they're consistent.

### Configuration

#### `config.holders`

`string`. Use this configuration to set the list of entities who hold the copyright for the project. E.g.

```js
{
    plugins: [
        ['@rmtc/plugin-mit-license', {
            holders: 'Rowan Manning'
        }]
    ]
}
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
