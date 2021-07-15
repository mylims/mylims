export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    SyncElementRevision: ['SyncDirRevision', 'SyncFileRevision'],
  },
};
export default result;
