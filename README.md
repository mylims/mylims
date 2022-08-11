# myLIMS

> Electronic lab notebook for open science

- [Installation](#installation)
- [Configuration](#configuration)
- [Run](#run)
  - [Development](#development)
  - [Production](#production)
- [Design](#design)
  - [Core](#core)
  - [Addons](#addons)

## Installation

The following commands will respectively install the dependencies and build the core app.

```shell
npm install
```

## Configuration

Edit it as needed. Example: auth config for ldap provider.

## Run

### Development

The following commands will start mongodb and ldap (to test the ldap provider) containers, setup a replica set on the mongodb server (to support migrations) and start the development server.

```shell
docker-compose up -d
node scripts/init-db.mjs
npm run dev
```

If it's the first time, don't forget to copy or create the `.env` file and is necessary to run the migration command

```shell
cp .env.example .env
npm i
node ace mongodb:migration:run
```

### Configuration

Is necessary to have running the [frontend server](./front/README.md#installation) in order con administrate de system. For this in the `localhost:3333/admin` server configuration is possible to administrate the addons, including the login methods. After is required to have created an user:

```shell
node ace user:create
```

### Production

```shell
cp .env.example .env.prod
docker-compose -f ./docker-compose.prod.yml build
docker-compose -f ./docker-compose.prod.yml up -d
docker-compose -f ./docker-compose.prod.yml exec backend node ace user:create
```

## Design

The new ELN is meant to be highly modular, allowing developers to add new functionalities by creating addons.

### Core

The core part is built on top of [AdonisJS](//preview.adonisjs.com/) framework. The core provides commons parts such as addons loading, user model and ELN routes.

New ELN uses MongoDB as the default database system using the [adonis-mongodb](https://github.com/zakodium/adonis-mongodb) provider.

### Addons

Addons can provide functionalities to the platform by exposing the following components:

- API routes in `routes.ts`
- Adonis providers `providers/*`
- Migrations `migrations/*`

An addons should be stored as a subfolder in the `addons` folder. It can be named as anything valid for the filesystem.

### Models

```mermaid
classDiagram
  class User {
    +ObjectId _id
    +String firstName
    +String lastName
    +String[] usernames
    +String[] emails
    +String role
    +AuthMethods authMethods
  }

  class File {
    +String _id
    +String filename
    +Number size
    +String collection
  }

  class SampleKind {
    +String _id
    +String name
    +String description
    +String color
    +JSON schema

    +fromInput(sampleKind ,input)
  }

  class Sample {
    +ObjectId _id
    +String[] sampleCode
    +String uuid10
    +ObjectId userId
    +String kind
    +String[] labels
    +String project
    +JSON meta
    +String title
    +String description
    +String comment
    +MeasurementLink[] measurements
    +SampleAttachment[] attachments
    +ObjectId[] parents

    +fromInput(sample, input)
  }
  Sample "1" --> "*" Sample
  Sample "*" --> "1" SampleKind
  Sample "*" --> "1" File

  class Measurement {
    +ObjectId _id
    +String username
    +ObjectId sampleId
    +String title
    +String fileId
    +ObjectId eventId
    +String comment
    +ObjectId createdBy
    +String description
  }
  Measurement "*" --> "*" User
  Measurement "*" --> "1" Sample
  Measurement "*" --> "1" Event

  class Notebook {
    +ObjectId _id
    +String title
    +String description
    +ObjectId userId
    +String[] labels
    +ObjectId[] samples
    +MeasurementLink[] measurements
    +String project
    +String content
  }
  Notebook "*" --> "*" Measurement
  Notebook "*" --> "*" Sample
  Notebook "*" --> "1" User
  Sample "*" --> "1" User

  class Event {
    +ObjectId _id
    +String topic
    +EventData data
    +EventProcessor[] processors
  }
  class EventProcessor {
    +String processorId
    +EventHistory[] history
  }
  class EventHistory {
    +String processId
    +String status
    +Date date
    +String message
  }
  class EventData {
    +String type
    +String fileId
  }
  Event --* EventData
  Event --* EventProcessor
  EventProcessor --* EventHistory
  EventData --> File
```
