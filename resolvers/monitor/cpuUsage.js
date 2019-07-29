const cpuStat = require('cpu-stat');
const os = require("os");

const getCPUUsage = ({ coreIndex, sampleMs, cb }) => {
    cpuStat.usagePercent({
        coreIndex,
        sampleMs,
    },
        function (err, percent, seconds) {
            if (err) {
                return console.log(err);
            }

            //the percentage cpu usage for core 0
            let cpu = os.cpus()[coreIndex];
            cb({
                core: coreIndex,
                ...cpu,
                percent
            })
        });
}

const getSystemCpuUsage = ({ sampleMs, cb }) => {
    let cpus = os.cpus();
    for (let x = 0;x<cpus.length;x++){
        getCPUUsage({ coreIndex: x, sampleMs, cb})
    }
}


module.exports = {
    getCPUUsage,
    getSystemCpuUsage
}