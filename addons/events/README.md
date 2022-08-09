# Events manager

## Introduction

An event is the middle point that works as a pipe system for possible complex
computational problems. In this specific case it's mainly used for a new file
added to the file system, where the listener service creates an event and the
processors are listening for specific types of events.

![event explanation](../../documentation/imgs/events-explanation.jpg)

When the processor pulls an event with a given "topic", the event manager blocks
it for another processor, this way is possible to parallelize the file processing

![event topics](../../documentation/imgs/event-topic.jpg)

## Possible states

- `pending`: Event that has not been processed or read
- `processing`: Event that has been requested from a processor
- `success`: Event that has been marked as finished as successful
- `error`: Event that has been marked as finished as errored (could be reprocessed later)

```mermaid
stateDiagram-v2
  [*] --> pending
  pending --> processing
  processing --> success
  processing --> error
  error --> [*]
  error --> processing
  success --> [*]
```

## REST API

A normal process for the API used in the [base processor](https://github.com/mylims/base-processor) library will follow the next sequence.

- event = `http://localhost:3333/addons/events`
- measurement = `http://localhost:3333/measurements`

```mermaid
sequenceDiagram
  participant Event
  Processor-->>Event: POST event/next-event?topic&processorId

  alt No event available
    Event-->>Processor: Error("No new event available")
  else Event available
    Event-->>Processor: EventClass

    alt Error while processing event
      Processor-->>Event: PUT event/set-event?eventId&processorId&status=ERROR&message
    else Successfully processed
      opt Has measurements attached to be created
        Processor-->>Measurements: POST measurement/create (send as formData)
      end

      Processor-->>Event: PUT event/set-event?eventId&processorId&status=SUCCESS
    end
  end
```
