# myLIMS front

> Electronic lab notebook for open science

- [Installation](#installation)
- [Configuration](#configuration)
- [Run](#run)
  - [Development](#development)
  - [Production](#production)
- [Design](#design)

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

### Development

The following command will run development server.

```shell
npm run dev
```

### Production

TBD

## Design

The frontend app uses [Next.js](https://nextjs.org/) framework.
