
# @rmtc/project

A class to represent the project that the @rmtc/toolchain CLI is running in.

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
npm install @rmtc/project
```

Create a project with:

```js
const {Project} = require('@rmtc/project');
const project = await Project.fromDirectory(`/path/to/project/directory`);
```

### `project.directoryPath`

`string`. The directory path that the project is in.

### `project.name`

`string`. The name of the project, extracted from either the `package.json` `name` property or the last part of the project directory path.

### `project.isPrivate`

`boolean | null`. Whether the project is marked as private in `package.json`. A value of `null` indicates that the package was not processable.

### `project.isMonorepo`

`boolean | null`. Whether the project is a monorepo, defining [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces). A value of `null` indicates that the package was not processable.


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2024, Rowan Manning
