# file-sync

- [Configuration](#configuration)

## Configuration

Please be sure to have run previously the installation and configuration on the [backend](../../README.md#installation) and the [frontend](../../frontend/README.md#installation).

After is required to have created an user:

```shell
node ace user:create
```

Now we can configure the different steps for the file synchronization. First you need to add the `root` field (where you want to copy the files) in the `localhost:3333/admin` server configuration, also is required to activate the addon.
Secondly you need to login in the current frontend instance at `localhost:3000/login`. There in the tab _File synchronization_ you can create a synchronization rule, meaning that this rule is going to be imported.

When the configurations are saved we can safely run

```shell
node ace file:sync
node ace file:import
```
