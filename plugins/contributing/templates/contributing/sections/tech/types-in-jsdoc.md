### TypeScript

Although this project is written in JavaScript, it is checked with [TypeScript](https://www.typescriptlang.org/) to ensure type safety. We also document all types with JSDoc so you should get type hints if your editor supports these.

Type errors will fail the build on any PRs. Most editors have a TypeScript plugin that will pick up errors, but you can also check types manually as part of the following command:

```
npx @rmtc/toolchain verify
```
