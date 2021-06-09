import { Logger } from '@nestjs/common';

export async function unarchiveFile(filePath: string, targetDir: string = null, options: any = { noDirectory: true }) {
  if (targetDir) {
    options.targetDir = targetDir;
  }

  const logger = new Logger('unarchiveFile');
  const decompress = require('decompress');

  try {
    return new Promise((resolve, reject) => {
      decompress(filePath, targetDir)
        .then(files => {
          resolve({ files });
        })
        .catch(err => {
          reject(err);
        });
    });
  } catch (error) {
    const message = `unarchiveFile(${filePath}) error: ${error}`;
    logger.error(message);
    return Promise.reject(new Error(message));
  }
}
