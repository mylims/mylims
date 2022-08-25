# myLIMS front

> Electronic lab notebook for open science

- [Installation](#installation)
- [Configuration](#configuration)
- [Run](#run)
- [Development](#development)
  - [Structure](#structure)
  - [Notes](#notes)

## Installation

The following command will install the dependencies.

```shell
npm install
```

## Configuration

Copy `.env.example` to `.env` and set variables accordingly.
Don't forget to expose addons pages using the following command:

```shell
cp .env.example .env
node scripts/addons-symlinks.js
```

## Run

The following command will run development server.

```shell
npm run dev
```

## Development

### Structure

The `src` structure contains the following logic:

- addons: For each addon created in the backed, there's an addon in the
  frontend, that is aimed to be deleted if it's not in the addons declaration.
  The most used are:
  - events: Visualization and linkage of processors and results.
  - fileSync: File synchronization from foreign folder to copy of content and notification to the processors.
- components: React elements defined for visual interaction. Notably the
  `tailwind-ui` folder contains all the components from `zakodium-components`,
  and are meant to be updated with `npm run components:update`.
- generated: Synchronized code from the backend using `graphql-codegen`.
- graphql: All the schemas to be used in the application. Even if the schema is
  defined in the backend, if there's no schema added in this folder, there's no
  code generated.
- models: Recurrent used types.
- pages: View for each route added.

### Notes

- For adding a menu to the navigation header, you can go to the
  `./src/components/Nav/RouteMenu.tsx` file, there is defined how to group
  routes and in the `pathmatch` property is defined when to highlight the menu
  button.
- For adding a route to the application, you should go to `./src/index.tsx`,
  where is just needed to modify the `useRoutes` parameter.
- For modifications on the layout, you should go to
  `./src/components/ElnLayout.tsx`.
