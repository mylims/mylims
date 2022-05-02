import { Filter } from 'mongodb';

import { UserInputError } from '@ioc:Zakodium/Apollo/Errors';
import { ModelAttributes, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { BaseMeasurement } from 'App/Models/Measurement/Base';
import Notebook from 'App/Models/Notebook';
import { MeasurementLink, Sample } from 'App/Models/Sample';
import User from 'App/Models/User';
import { MEASUREMENTS } from 'App/Resolvers/Measurement';
import {
  GqlMeasurementLinkInput,
  GqlMeasurementTypes,
  GqlNotebookFilterInput,
  GqlNotebookSortField,
  GqlResolvers,
  GqlSortDirection,
  Maybe,
} from 'App/graphql';
import {
  filterDate,
  filterText,
  filterUser,
  NotReadOnly,
  removeNullable,
} from 'App/utils';

const resolvers: GqlResolvers = {
  Notebook: {
    id: (notebook: Notebook): string => notebook._id.toHexString(),
    async user(notebook: Notebook) {
      const user = await User.find(notebook.userId);
      if (!user) {
        throw new UserInputError('User not found', { argumentName: 'userId' });
      }
      return user;
    },
    measurements(notebook: Notebook) {
      return Promise.all(
        notebook.measurements.map(async (measurement) => {
          const ans = await MEASUREMENTS[
            measurement.type as GqlMeasurementTypes
          ].find(measurement.id);
          if (!ans) {
            throw new UserInputError('Measurement not found', {
              argumentName: 'id',
            });
          }
          return {
            ...(ans.toJSON() as BaseMeasurement),
            type: measurement.type,
          };
        }),
      );
    },
    samples(notebook: Notebook) {
      return Promise.all(
        notebook.samples.map(async (sample) => {
          const ans = await Sample.find(sample);
          if (!ans) {
            throw new UserInputError('Sample not found', {
              argumentName: 'id',
            });
          }
          return ans.toJSON() as Sample;
        }),
      );
    },
  },
  Query: {
    async notebook(_, { id }) {
      const notebook = await Notebook.find(new ObjectId(id));
      if (notebook) return notebook;

      throw new UserInputError('Id not found', { argumentName: 'id' });
    },
    async notebooks(_, { limit, skip, filterBy, sortBy }) {
      const {
        field = GqlNotebookSortField.CREATEDAT,
        direction = GqlSortDirection.DESC,
      } = sortBy || {};

      const filter = await createFilter(filterBy);

      let notebookCursor = Notebook.query(filter).sortBy(
        field,
        direction === GqlSortDirection.DESC ? -1 : 1,
      );
      const totalCount = await notebookCursor.count();
      if (skip) notebookCursor = notebookCursor.skip(skip);
      if (limit) notebookCursor = notebookCursor.limit(limit);

      const list = await notebookCursor.all();
      return { list, totalCount };
    },
  },
  Mutation: {
    async createNotebook(_, { input }) {
      const user = await User.find(new ObjectId(input.userId));
      if (!user) {
        throw new UserInputError('User not found', { argumentName: 'userId' });
      }

      return Notebook.create(
        removeNullable({
          ...input,
          userId: user._id,
          samples: linkedArray(input.samples),
          measurements: linkedMeasurement(input.measurements),
        }),
      );
    },
    async updateNotebook(_, { id, input }) {
      const user = await User.find(new ObjectId(input.userId));
      if (!user) {
        throw new UserInputError('User not found', { argumentName: 'userId' });
      }

      const notebook = await Notebook.find(new ObjectId(id));
      if (!notebook) {
        throw new UserInputError('Id not found', { argumentName: 'id' });
      }

      const notebookInput = removeNullable(input);
      notebook.title = notebookInput.title;
      notebook.description = notebookInput.description;
      notebook.labels = notebookInput.labels;
      notebook.project = notebookInput.project;
      notebook.content = notebookInput.content;
      notebook.userId = user._id;
      notebook.samples = linkedArray(notebookInput.samples);
      notebook.measurements = linkedMeasurement(notebookInput.measurements);
      await notebook.save();
      return notebook;
    },
  },
};

async function createFilter(
  filterBy: Maybe<GqlNotebookFilterInput> | undefined,
): Promise<Filter<ModelAttributes<Notebook>>> {
  if (!filterBy) return {};

  let filter: Filter<NotReadOnly<ModelAttributes<Notebook>>> = {};
  filter.labels = filterText(filterBy.labels);
  filter.project = filterText(filterBy.project);
  filter.title = filterText(filterBy.title);
  filter.createdAt = filterDate(filterBy.createdAt);
  filter.userId = filterUser(filterBy.userId);

  return removeNullable({ ...filter });
}

function linkedArray(list: string[]): ObjectId[] {
  return list.map((id) => new ObjectId(id));
}
function linkedMeasurement(list: GqlMeasurementLinkInput[]): MeasurementLink[] {
  return list.map(({ id, type }) => ({
    type: type ?? GqlMeasurementTypes.TRANSFER,
    id: new ObjectId(id),
    date: new Date(),
  }));
}

export default resolvers;
