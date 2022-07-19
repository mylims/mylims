
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "EventData": [
      "EventDataFile"
    ],
    "Pagination": [
      "EventPage",
      "FilesFlatPage",
      "MeasurementPage",
      "NotebookPage",
      "SamplePage",
      "UserPage"
    ],
    "PaginationNode": [
      "Event",
      "Measurement",
      "Notebook",
      "Sample",
      "SyncFileRevision",
      "User"
    ],
    "SyncElementRevision": [
      "SyncDirRevision",
      "SyncFileRevision"
    ]
  }
};
      export default result;
    