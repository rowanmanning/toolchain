
# @rmtc/config

Configuration loading, parsing, and validation for the @rmtc/toolchain CLI.

> [!WARNING]<br/>
> This package is intended for internal use by [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme). It's probably not useful by itself.

> [!CAUTION]<br/>
> This project is in early alpha, it's highly likely that we'll introduce accidental breaking changes.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+


## Usage

Install the module with [npm](https://www.npmjs.com/):

```sh
npm install @rmtc/config
```

Read a valid `.rmtc.json5` config file with:

```js
const {Config} = require('@rmtc/config');
await Config.fromFile(`/path/to/project/directory`);
```

There's no need to include `.rmtc.json5` in the file path, it's added automatically.

The above function will throw an error if:

  * There is no config file
  * The config file is not valid [JSON5](https://json5.org/)
  * The config file does not match the [config schema](./schema.json)


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
