const { createLogger, format, transports, config } = require('winston')

const loggerConfig = createLogger({
    levels: config.syslog.levels,
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.colorize()
    ),
    transports: [
        new transports.Console()
    ]
})

module.exports = loggerConfig 
