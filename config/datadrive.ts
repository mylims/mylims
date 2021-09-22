import { DataDriveConfig } from '@ioc:Zakodium/DataDrive';

const dataDriveConfig: DataDriveConfig = {
  drives: {
    local: {
      disk: 'local',
      prefix: 'fileSync/imports',
    },
    files: {
      disk: 'local',
      prefix: 'generated/files',
    },
  },
};

export default dataDriveConfig;
