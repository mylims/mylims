export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    EventData: ['EventDataFile'],
    Pagination: ['EventPage', 'FilesFlatPage', 'MeasurementPage'],
    PaginationNode: ['Event', 'Measurement', 'SyncFileRevision'],
    SyncElementRevision: ['SyncDirRevision', 'SyncFileRevision'],
  },
};
export default result;
