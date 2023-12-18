
# @rmtc/logger

Consistent logging for the @rmtc/toolchain CLI.

> [!WARNING]<br/>
> This package is intended for internal use by [@rmtc/toolchain](https://github.com/rowanmanning/toolchain#readme). It's probably not useful by itself.

> [!CAUTION]<br/>
> This project is in early alpha, it's highly likely that we'll introduce accidental breaking changes.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Logging](#logging)
    * [Configuration](#configuration)
      * [`logLevel`](#loglevel)
      * [`prefix`](#prefix)
    * [Child loggers](#child-loggers)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+


## Usage

Install the module with [npm](https://www.npmjs.com/):

```sh
npm install @rmtc/logger
```

This module exports a Logger class which is used to provide consistent logging for the command line interfaces:

```js
const {Logger} = require('@rmtc/logger');
const logger = new Logger();
logger.info('Hello World!');
```

### Logging

The logger has different log methods depending on the level of log you want to output:

```js
logger.debug('This is a debug-level message');
logger.info('This is an info-level message');
logger.warn('This is a warning message');
logger.error('This is an error message');
```

The `error` method can also accept an `Error` object, which it will render neatly:

```js
logger.error(new Error('something went wrong));
```

### Configuration

When you create a logger, you can configure it with the following options by passing them as part of an options object:

```js
const logger = new Logger({
    // options go here
});
```

The available options are:

#### `logLevel`

`String`. The lowest log level to output logs for. Any less important log than this level will not be output. Defaults to `process.env.LOG_LEVEL`, and if that's not set then `info`. E.g.

```js
const logger = new Logger({ logLevel: 'warn' });
logger.info('shh'); // Logs nothing
```

#### `prefix`

`String`. A string to prepend to all log messages from the logger. A space will be added to separate the prefix from the message. Defaults to an empty string. E.g.

```js
const logger = new Logger({ prefix: 'Hello' });
logger.info('World!'); // Logs "Hello World!"
```

### Child loggers

If you want to chain prefixes together, you can create child loggers. These inherit the settings from their parent but you can add a further prefix. E.g.

```js
const logger = new Logger({ prefix: 'one' });
logger.info('testing'); // Logs "one testing"

const childLogger = logger.child({ prefix: 'two' });
logger.info('testing'); // Logs "one two testing"
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/toolchain#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/toolchain/blob/main/LICENSE) license.<br/>
Copyright &copy; 2023, Rowan Manning
