const { Http } = require("winston/lib/winston/transports");

class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); /* Add message property */
        this.code = errorCode /* Add error code on this property */
    }
}

module.exports = HttpError;