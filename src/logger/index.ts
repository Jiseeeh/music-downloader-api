import { createLogger, format, transports } from "winston";

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: format.combine(
    format.label({ label: "music-vid-downloader" }),
    format.simple(),
    format.align(),
    format.colorize(),
    format.timestamp(),
    format.splat(),
    myFormat
  ),
  transports: [new transports.Console()],
});

export default logger;
