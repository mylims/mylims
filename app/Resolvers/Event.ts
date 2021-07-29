import Event from 'App/Models/Event';
import { GqlEventStatus, GqlResolvers } from 'App/graphql';

function eventMapper({ _id: { id, topic }, history }: Event) {
  return { id, topic, history };
}

const resolvers: GqlResolvers = {
  Query: {
    async eventsByTopic(_, { topic }) {
      const events = await Event.query({ '_id.topic': topic }).all();
      return events.map(eventMapper);
    },

    async eventsByTopicFrom(_, { topic, from }) {
      const events = await Event.query({
        '_id.topic': topic,
        '_id.id': { $gte: from },
      }).all();
      return events.map(eventMapper);
    },
  },

  Mutation: {
    async createEvent(_, { topic, emitter }) {
      const previousEvent = await Event.query(
        { '_id.topic': topic },
        { driverOptions: { sort: { '_id.id': -1 } } },
      ).first();

      const nextId = previousEvent ? previousEvent._id.id + 1 : 0;

      const newEvent = await Event.create({
        _id: { topic, id: nextId },
        history: [
          {
            status: GqlEventStatus.OPEN,
            emitter: emitter || undefined,
            date: new Date(),
          },
        ],
      });
      await newEvent.save();
      return eventMapper(newEvent);
    },

    async changeStatusEvent(_, { topic, emitter, id, status }) {
      const event = await Event.findBy('_id', { id, topic });
      if (!event) throw new Error(`Event not found with id: ${topic}_${id}`);

      event.history.unshift({
        status,
        emitter: emitter || undefined,
        date: new Date(),
      });
      await event.save();
      return eventMapper(event);
    },
  },
};

export default resolvers;
