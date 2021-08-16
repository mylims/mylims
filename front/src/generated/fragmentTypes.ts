export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    EventData: [],
    SyncElementRevision: ['SyncDirRevision', 'SyncFileRevision'],
  },
};
export default result;
