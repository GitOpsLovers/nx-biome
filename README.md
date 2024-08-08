<p align="center"><img src="https://raw.githubusercontent.com/GitOpsLovers/nx-biome/main/banner.jpg" alt="NX Biome"/></p>

<div align="center">

# nx-biome

**[Nx](https://nx.dev) plugin to use [Biome](https://biomejs.dev/) toolchain in your Nx workspace.**

[![Nx peer dependency version](https://img.shields.io/npm/dependency-version/nx-stylelint/@nx/devkit?label=Nx&logo=nx&style=flat-square)](https://nx.dev)
[![Stylelint peer dependency version](https://img.shields.io/npm/dependency-version/nx-stylelint/peer/stylelint?label=Stylelint&logo=stylelint&style=flat-square)](https://stylelint.io)
[![CI](https://img.shields.io/github/actions/workflow/status/Phillip9587/nx-stylelint/ci.yml?branch=main&label=CI&style=flat-square&logo=github)](https://github.com/Phillip9587/nx-stylelint/actions/workflows/ci.yml)
[![LICENSE](https://img.shields.io/github/license/phillip9587/nx-stylelint?style=flat-square)](https://github.com/phillip9587/nx-stylelint/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/nx-stylelint?style=flat-square&logo=npm)](https://www.npmjs.com/package/nx-stylelint)
[![npm](https://img.shields.io/npm/dt/nx-stylelint?style=flat-square&logo=npm)](https://www.npmjs.com/package/nx-stylelint)

</div>

<hr/>

# 🚀 Features

@gitopslovers/nx-biome provides a set of power-ups for [Nx](https://nx.dev) to lint, format and analyze your projects with [Biome](ttps://biomejs.dev/).

- **Executor**: Provides some executor to lint, format and analyze your files with Biome.
- **Generators**: Helping you to configure your projects.
- **Configuration**: Per Project configuration of Biome extending a workspace configuration.
- **Only Affected**: Uses Nx to support linting formatting and analyzing only affected projects.
- **Cache**: Uses Nx to cache already touched projects.

# 📦 Installation

**using [npm](https://npmjs.com)**

```shell
npm i -D @gitopslovers/nx-biome
```

# 🛠️ Configuring Biome for a project

To add a Biome configuration to a project you just have to run the `@gitopslovers/nx-biome:configuration` generator.

```shell
nx g @gitopslovers/nx-biome:configuration --project <projectName>
```

The generator adds a `biome.json` configuration file at the project root which extends the root `biome.json` and adds a `biome-lint` target to the project.

At the first run the generator installs all required dependencies and creates a `biome.json` file at the workspace root. It also configures the `namedInputs` for the `biome-lint` targets.

# Examples

Run `biome-lint` for a project

```shell
nx biome-lint {{projectName}}
```

Run `biome-lint` for all projects

```shell
nx run-many --target=biome-lint
```

Run `biome-lint` for affected projects

```shell
nx affected --target=biome-lint
```

# 📖 Documentation

## `@gitopslovers/nx-biome:configuration` generator

Add Biome configuration to a project.

### Usage

Add configuration to a project:

`nx g @gitopslovers/nx-biome:configuration --project projectName`

### Options

| Option       | Value                                                                       | Description                                                                           |
| ------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `project`    | `string`                                                                    | The name of the project.                                                              |

## `@gitopslovers/nx-biome:biome-lint` executor

Run Biome linter on a project.

Target Options can be configured in `project.json` or when the executor is invoked.

See: https://nx.dev/configuration/projectjson#targets

### Options

| Option                          | Value      | Default  | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lintFilePatterns`              | `string[]` |          | One or more files/dirs/globs to pass directly to Biome's lint method.                                                                                                                                                                                                                 |
| `write`              | `boolean` |          | Apply the safe fixes when linting the target where Biome is executed.                                                                                                                                                                                                                 |
| `unsafe`              | `boolean` |          | Apply the unsafe fixes when linting the target where Biome is executed.                                                                                                                                                                                                                 |
