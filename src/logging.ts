import { Writable } from 'stream';
import * as winston from 'winston';

const level = 'debug';

const defaultTransport = new winston.transports.Console();

export const logger: winston.Logger = winston.createLogger({
    level: level,
    format: winston.format.combine(
        winston.format.timestamp({
            format: "HH:mm:ss",
        }),
        winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`),
    ),
    transports: [
        defaultTransport
    ],
});

interface Channel {
    append(value: string): void;
}

export function init(outputChannel: Channel) {
    logger.clear();
    const outputStream = new Writable({
        write(chunk: any, encoding, callback) {
            outputChannel.append(chunk.toString());
            callback();
        }
    });
    logger.add(new winston.transports.Stream({ stream: outputStream }));
}

export function setLevel(level: string) {
    logger.level = level.toLowerCase();
}
