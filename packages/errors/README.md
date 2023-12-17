
# @rmtc/errors

Custom errors for the @rmtc/toolchain CLI.

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
npm install @rmtc/errors
```

This module exports error classes for use across the rest of this project:

```js
const {ToolchainError} = require('@rmtc/errors');
throw new ToolchainError('this is a message');
```

You can pass a `code` as a property on the second argument to the error constructor to provide a machine-readable alternative to the message:

```js
throw new ToolchainError('this is a message', { code: 'EXAMPLE_CODE' });
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
