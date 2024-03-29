
# @rmtc/toolchain

A command-line task runner.

> [!TIP]<br/>
> This package forms part of [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme). You'll find further documentation in the main project README.

> [!WARNING]<br/>
> This project is intended for use in [@rowanmanning](https://github.com/rowanmanning/)'s projects. It's free to use but I don't offer support for use-cases outside of what I need.


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
npm install --save-dev @rmtc/toolchain
```

Get command-line help with:

```sh
npx @rmtc/toolchain --help
```

List available workflows and steps with:

```sh
npx @rmtc/toolchain --list
```

Run a single workflow:

```sh
npx @rmtc/toolchain workflowName
```

Run multiple workflows:

```sh
npx @rmtc/toolchain workflowName anotherWorkflowName ...
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
