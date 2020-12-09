import * as winston from 'winston';

import * as color from 'chalk';
import { Logger, LoggerOptions, transport } from 'winston';

export class LoggerService {
  public static loggerOptions: LoggerOptions = {
    transports: [new winston.transports.Console()],
  };
  private readonly logger: Logger;
  public scanId: number;

  constructor(private context: string, transport?) {
    this.logger = (winston as any).createLogger(LoggerService.loggerOptions);
  }

  debug(message: string): void {
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('warn', message);
  }

  log(message: string): void {
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('info', message);
  }

  error(message: string, trace?: any): void {
    const currentDate = new Date();
    // i think the trace should be JSON Stringified
    this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('error', message, trace);
  }

  warn(message: string): void {
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('warn', message);
  }

  overrideOptions(options: LoggerOptions) {
    this.logger.configure(options);
  }

  fileTransport(fileName: string) {
    const { combine, timestamp, label, printf } = winston.format;
    const myFormat = printf(({ level, message, context, timestamp }) => {
      return `${timestamp} [${context}] ${level}: ${message}`;
    });

    const files = new winston.transports.File({
      filename: fileName,
      format: winston.format.combine(winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }), myFormat),
    });
    const console = new winston.transports.Console();
    this.logger
      .clear() // Remove all transports
      .add(files);
  }

  private formatedLog(level: string, message: string, error?): void {
    let result = `[${color.blue('CUSTOMLOGGER')}]`;
    if (this.scanId) {
      result += `[${color.greenBright(this.scanId)}] `;
    }
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    switch (level) {
      case 'info':
        result += `[${color.blue('INFO')}] ${color.dim.yellow.bold.underline(currentDate)} [${color.green(
          this.context,
        )}] ${message}`;
        break;
      case 'error':
        result += `[${color.red('ERR')}] ${color.dim.yellow.bold.underline(currentDate)} [${color.green(
          this.context,
        )}] ${message}`;
        // if (error) {
        //   this.prettyError.render(error, true);
        // }
        break;
      case 'warn':
        result += `[${color.yellow('WARN')}] ${color.dim.yellow.bold.underline(currentDate)} [${color.green(
          this.context,
        )}] ${message}`;
        break;
      default:
        break;
    }
    console.log(result);
  }
}
