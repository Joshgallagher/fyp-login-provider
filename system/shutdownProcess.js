const shutdownProcess = (server, process) => {
    server.close(err => {
        if (err) {
            process.exitCode = 1
        }

        process.exit()
    })
}

module.exports = shutdownProcess
