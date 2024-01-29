
# @rmtc/plugin-biome

A [Biome](https://biomejs.dev/) plugin for [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme).

> [!WARNING]<br/>
> This project is intended for use in [@rowanmanning](https://github.com/rowanmanning/)'s projects. It's free to use but I don't offer support for use-cases outside of what I need.


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
npm install --save-dev @rmtc/plugin-biome
```

Include it in your `.rmtc.json` file:

```js
{
    plugins: [
        // ...
        '@rmtc/plugin-biome'
    ]
    // ...
}
```

### Workflows

This plugin defines the following workflows:

  * **`format`:** a general workflow used to automatically format code.

  * **`verify`:** a general workflow used to verify code quality.

### Steps

This plugin defines the following steps that can be added to any workflow:

  * **`biome:format`:** run the `biome format` command-line tool on the whole project with the `--write` flag, so that formatting changes are applied in place.

  * **`biome:lint`:** run the `biome lint` command-line tool on the whole project.

E.g. if you prefer to define a `lint` workflow, use the following:

```js
{
    plugins: ['@rmtc/plugin-eslint'],
    workflows: {
        lint: ['biome:lint']
    }
}
```

### Configuration

This plugin provides no additional configuration. To configure the way that the `biome` command-line tool runs, you should [use one of the configuration methods that they suggest](https://biomejs.dev/reference/configuration/).


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
