const Sentry = require("../sentryClient");
const logger = require("../graylogClient");
const resolvers = require("../resolvers/resolvers");

let doNotLog = [
    "getSystemCpuUsage",
    "getMemwatchStats",
    "getMemwatchLeak",
    "getMemoryUsage"
]

const isAllowed = info => {
    return doNotLog.indexOf(info.fieldName) === -1
}

const topLevel = info => {
    return info.parentType == "Query" ||
           info.parentType == "Mutation" ||
           info.parentType == "Subscription"
}

const onRequest = async (resolve, root, args, context, info) => {
    let logInfo = topLevel(info) && isAllowed(info);
    if (logInfo){
        console.log(`resolving ${info.fieldName}`);
        logger.info(`Resolving: ${info.fieldName}`,{ user: context.user });
    }
    let res;
    try {
        res = await resolve(root, args, context, info);
    } catch (e) {
        if (logInfo) {
            logger.error(`Failed to resolve: ${e.message}`, { user: context.user })
        }
        Sentry.captureException(e);
        console.log("Reported error to sentry/graylog");
        throw e;
    }
    if (logInfo) {
        logger.info(`Resolved: ${info.fieldName}`, { user: context.user });
    }
    return res;
}


module.exports = [
    onRequest
]