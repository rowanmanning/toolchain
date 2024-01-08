# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @rmtc/config bumped from ^0.1.0 to ^0.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @rmtc/config bumped from ^0.1.1 to ^0.2.0

## [0.3.0](https://github.com/rowanmanning/toolchain/compare/plugin-v0.2.4...plugin-v0.3.0) (2024-01-08)


### ⚠ BREAKING CHANGES

* protect all internal plugin methods
* initialise all plugins together

### Features

* allow access to other plugins in the set ([c2db94c](https://github.com/rowanmanning/toolchain/commit/c2db94c7b1bdeea7723245841e6f3d258df5595e))
* initialise all plugins together ([d0c9c5c](https://github.com/rowanmanning/toolchain/commit/d0c9c5ce6b576334a97f431b8ef94cb2c75024b4))


### Bug Fixes

* protect all internal plugin methods ([2caa8b6](https://github.com/rowanmanning/toolchain/commit/2caa8b6789ed519127bbf216c13e1f40ce7fc093))

## [0.2.4](https://github.com/rowanmanning/toolchain/compare/plugin-v0.2.3...plugin-v0.2.4) (2023-12-28)


### Bug Fixes

* bump detect-indentation from 6.6.0 to 6.7.0 ([68298e8](https://github.com/rowanmanning/toolchain/commit/68298e8678826487788a97fd0c9355f4198674a7))
* switch to a global npmignore ([8c9de23](https://github.com/rowanmanning/toolchain/commit/8c9de2325e0783d1471cbd0f17a684d5eb301246))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @rmtc/config bumped from ^0.3.2 to ^0.3.3
    * @rmtc/errors bumped from ^0.2.1 to ^0.2.2
    * @rmtc/logger bumped from ^0.1.2 to ^0.1.3

## [0.2.3](https://github.com/rowanmanning/toolchain/compare/plugin-v0.2.2...plugin-v0.2.3) (2023-12-23)


### Features

* add a method to edit JSON files ([5e97e2c](https://github.com/rowanmanning/toolchain/commit/5e97e2cb91cbaa6e477637437a0dfa8fddbe101a))

## [0.2.2](https://github.com/rowanmanning/toolchain/compare/plugin-v0.2.1...plugin-v0.2.2) (2023-12-18)


### Documentation Changes

* finish documentation for plugin creation ([d899733](https://github.com/rowanmanning/toolchain/commit/d899733e1c2f973b2825ae18ccdf73ec06bb3965))
* fix some typos ([d1decb6](https://github.com/rowanmanning/toolchain/commit/d1decb67f35c587f557e5f0ca0e71f547a53d466))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @rmtc/config bumped from ^0.3.1 to ^0.3.2
    * @rmtc/errors bumped from ^0.2.0 to ^0.2.1
    * @rmtc/logger bumped from ^0.1.1 to ^0.1.2

## [0.2.1](https://github.com/rowanmanning/toolchain/compare/plugin-v0.2.0...plugin-v0.2.1) (2023-12-17)


### Bug Fixes

* remove an unused import ([7b1f9b2](https://github.com/rowanmanning/toolchain/commit/7b1f9b260b09caed1ea97d7f72f559bd27e0226b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @rmtc/config bumped from ^0.3.0 to ^0.3.1
    * @rmtc/logger bumped from ^0.1.0 to ^0.1.1

## [0.2.0](https://github.com/rowanmanning/toolchain/compare/plugin-v0.1.2...plugin-v0.2.0) (2023-12-16)


### ⚠ BREAKING CHANGES

* run executables with node_modules paths

### Bug Fixes

* run executables with node_modules paths ([3a13993](https://github.com/rowanmanning/toolchain/commit/3a13993248e067922f5970af57097bc625fad6d9))
* switch to the new error inferfaces ([da2e5fb](https://github.com/rowanmanning/toolchain/commit/da2e5fb17ba0b45d990d6eecbc2e63540aa2aa20))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @rmtc/config bumped from ^0.2.0 to ^0.3.0
    * @rmtc/errors bumped from ^0.1.0 to ^0.2.0

## 0.1.0 (2023-12-13)


### Features

* add a basic mocha plugin ([64611da](https://github.com/rowanmanning/toolchain/commit/64611da7a75368a53ad73b38806409760304b0ac))
* allow overriding workflow steps in config ([68bb900](https://github.com/rowanmanning/toolchain/commit/68bb900a8b2cc4003d020bfb1e30b7e03d8db590))
* allow plugins to define install steps ([c8c2897](https://github.com/rowanmanning/toolchain/commit/c8c28973f195cb88d71e1f6f77bd63bb23ee4825))
* make the eslint plugin work ([e7e342a](https://github.com/rowanmanning/toolchain/commit/e7e342a916e8c6bf5c10f72ccf04fb461b201a42))


### Bug Fixes

* correct the internal dependency versions ([8ea842a](https://github.com/rowanmanning/toolchain/commit/8ea842a9ecb6bce2a075896b316c1108149b8f28))
* don't allow defining duplicate steps ([648e18c](https://github.com/rowanmanning/toolchain/commit/648e18cf53d6aadb9908be06b4aefbff74a5754c))
* rename the project directory plugin property ([98a99ae](https://github.com/rowanmanning/toolchain/commit/98a99ae8927d6ea34f5965b7564584a458b9f71b))
* simplify install scripts ([a510579](https://github.com/rowanmanning/toolchain/commit/a510579de17e4e1ea9e63964749ad0f0c7bab9e2))
* support npm 10 ([0596083](https://github.com/rowanmanning/toolchain/commit/05960837bbf1637f258a4080971b3f36364dc2cd))


### Documentation Changes

* add READMEs for all packages ([9109e30](https://github.com/rowanmanning/toolchain/commit/9109e304fb3b2d1a810e1fc948fef2b325be1099))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @rmtc/config bumped from ^0.0.0 to ^0.1.0
    * @rmtc/errors bumped from ^0.0.0 to ^0.1.0
    * @rmtc/logger bumped from ^0.0.0 to ^0.1.0
