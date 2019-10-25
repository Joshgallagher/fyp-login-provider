const { createLogger, format, transports } = require('winston')

const loggerConfig = createLogger({
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
