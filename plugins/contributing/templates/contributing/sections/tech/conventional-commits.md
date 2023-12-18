### Committing

Commit messages must be written using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This is how our [release system](https://github.com/googleapis/release-please#readme) knows what a given commit means.

```
<type>: <description>

[body]
```

The `type` can be any of the following: `feat`, `fix`, `docs` or `chore`.

The prefix is used to calculate the [Semantic Versioning](https://semver.org/) release:

| **type**  | when to use                                            | release level |
| --------- | ------------------------------------------------------ | ------------- |
| feat      | a feature has been added                               | `minor`       |
| fix       | a bug has been patched                                 | `patch`       |
| docs      | a change to documentation                              | `patch`       |
| chore     | repo maintenance and support tasks                     | none          |

Indicate a breaking change by placing an exclamation (`!`) between the type name and the colon, e.g.

```
feat!: add a breaking feature
```
