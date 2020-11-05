import { Logger } from '@nestjs/common';
import * as execa from 'execa';

export function shellExecuteSync(command: string, options: any = {}, logDir?: string): string {
  const logger = new Logger('ShellExecuteSync');
  try {
    logger.log(`*** command STARTED: ${command}`);
    const { stdout } = execa.commandSync(command + ' ' + logOption(logDir), {
      ...options,
      stdio: 'inherit',
      shell: true,
    });
    logger.log(`*** command COMPLETED: ${command}`);
    return stdout;
  } catch (error) {
    logger.error(`*** command ERROR: ${error} ${command}`);
  }
}

export function shellExecute(command: string, options: any = {}, logDir?: string): Promise<void> {
  const logger = new Logger('ShellExecute');
  logger.log(`*** command STARTED: ${command}`);
  return execa
    .command(command + ' ' + logOption(logDir), { ...options, stdio: 'inherit', shell: true })
    .then(() => {
      logger.log(`*** command COMPLETED: ${command}`);
    })
    .catch(error => {
      logger.error(`*** command ERROR: ${error} ${command}`);
    });
}

export function logOption(logDir: string) {
  if (logDir) {
    return ' 2>&1 | tee -a ' + logDir + '/output.txt';
  }
}
