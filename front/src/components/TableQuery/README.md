# TableQuery

Table component used for connecting to a GraphQL URL with
[the predefined structure](../../../../app/Schemas/general.graphql) for a
pagination system.

When a filter, sort or pagination is changed, this will be applied to the search
parameters of the URL, therefore this component is highly dependent of the
GraphQL schema and `'react-router-dom'` library.

## Example

```tsx
import { TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import type { Unflatten } from '@/components/TableQuery/types';
import { getVariablesFromQuery } from '@/components/TableQuery/utils';

function Example() {
  const { query, setQuery } = useTableQuery({
    // Default page
    page: '1',
    // Default field to sort
    'sortBy.field': 'createdAt',
    // Default order to sort
    'sortBy.direction': 'desc',
  });

  // Define the types for input and output of the query
  type QueryVariables = Unflatten<InputType, OutputType>;
  // Parses from the URL query to Apollo variables
  const variables = getVariablesFromQuery<QueryVariables>(query);
  // Use a hook from Apollo
  const { loading, error, data } = useExampleQuery({ variables });

  return (
    <TableQuery
      data={data?.example}
      loading={loading}
      error={error}
      query={query}
      onQueryChange={(query) => setQuery(query)}
    >
      {/* Shows the filter applied */}
      <TableQuery.Queries />
      {/* Adds an extra column for buttons */}
      <TableQuery.ActionsColumn width={200}>
        {(row) => {
          // TODO: Here is possible to add a custom action
          return <span>action</span>;
        }}
      </TableQuery.ActionsColumn>

      {/* Basic types */}
      <TableQuery.TextColumn title="Text" dataPath="text" />
      <TableQuery.DateColumn title="Creation date" dataPath="createdAt" />
      <TableQuery.UserColumn title="User" dataPath="user" />
      <TableQuery.NumberColumn title="Number" dataPath="number" />

      {/* Filters on the position of a list of strings */}
      <TableQuery.TextListColumn
        title="Text list item"
        dataPath="textList"
        queyIndex={0}
      />
      {/* Displays a field in the "meta" dictionary */}
      <TableQuery.TextMetaColumn title="Meta field" dataPath="meta" />
      {/* Allows to search different values inside a list of strings */}
      <TableQuery.MultiSelectColumn
        title="Multiple selection"
        dataPath="multiSelect"
        options={['1', '2']}
      />
    </TableQuery>
  );
}
```
