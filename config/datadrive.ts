import { DataDriveConfig } from '@ioc:DataDrive';

const dataDriveConfig: DataDriveConfig = {
  drives: {
    local: {
      disk: 'local',
      prefix: 'fileSync/imports',
    },
  },
};

export default dataDriveConfig;
