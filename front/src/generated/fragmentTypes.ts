export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    EventData: ['EventDataFile'],
    Pagination: [
      'EventPage',
      'FilesFlatPage',
      'MeasurementPage',
      'SamplePage',
      'UserPage',
    ],
    PaginationNode: [
      'Event',
      'Measurement',
      'Sample',
      'SyncFileRevision',
      'User',
    ],
    SyncElementRevision: ['SyncDirRevision', 'SyncFileRevision'],
  },
};
export default result;
