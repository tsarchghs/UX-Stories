const os = require("os");
const memwatch = require('node-memwatch');
const { getSystemCpuUsage } = require("./cpuUsage");

const CHANNEL_GET_SYSTEM_CPU_USAGE = "CHANNEL_GET_SYSTEM_CPU_USAGE" 
const GET_MEMWATCH_LEAK = "GET_MEMWATCH_LEAK";
const GET_MEMWATCH_STATS = "GET_MEMWATCH_STATS";
const GET_MEMORY_USAGE = "GET_MEMORY_USAGE";

module.exports = {
    getMemwatchStats: {
        subscribe: (parent, args, { pubsub }) => {
            memwatch.on('stats', stats => {
                console.log(stats)
                pubsub.publish(GET_MEMWATCH_LEAK, { getMemwatchStats: stats })
            })
            return pubsub.asyncIterator(GET_MEMWATCH_STATS)
        }
    },
    getMemwatchLeak: {
        subscribe: (parent, args, { pubsub }) => {
            memwatch.on('leak', info => {
                console.log(info)
                pubsub.publish(GET_MEMWATCH_LEAK, { getMemwatchLeak: info })
            })
            return pubsub.asyncIterator(GET_MEMWATCH_LEAK)
        }
    },
    getSystemCpuUsage: {
        subscribe: (parent, args, { pubsub }) => {
            console.log(123)
            args.everyMs = 1000;
            setInterval(() => {
                let cb = cpu => {
                    pubsub.publish(CHANNEL_GET_SYSTEM_CPU_USAGE, { getSystemCpuUsage: cpu });
                }
                getSystemCpuUsage({ sampleMs: args.everyMs, cb})
            }, args.everyMs);
            return pubsub.asyncIterator(CHANNEL_GET_SYSTEM_CPU_USAGE)
        }
    },
    getMemoryUsage: {
        subscribe: (parent,args, { pubsub }) => {
            args.everyMs = 2500;
            setInterval(() => {
                let freeMemory = os.freemem() / 1048576;
                let totalMemory = os.totalmem() / 1048576;
                pubsub.publish(GET_MEMORY_USAGE, { 
                    getMemoryUsage: {
                        freeMemory,
                        totalMemory
                    } 
                })
            }, args.everyMs);
            return pubsub.asyncIterator(GET_MEMORY_USAGE)
        }
    }

}