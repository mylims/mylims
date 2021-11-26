export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Activity: ['ActivityFile', 'ActivityMeasurement'],
    EventData: ['EventDataFile'],
    Pagination: ['EventPage', 'FilesFlatPage', 'MeasurementPage', 'SamplePage'],
    PaginationNode: ['Event', 'Measurement', 'Sample', 'SyncFileRevision'],
    SyncElementRevision: ['SyncDirRevision', 'SyncFileRevision'],
  },
};
export default result;
