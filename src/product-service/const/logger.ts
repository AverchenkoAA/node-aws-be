import * as winston from 'winston';

export const LOGGER = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});
