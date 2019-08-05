var graylog2 = require("graylog2");

var logger = new graylog2.graylog({
    servers: [
        { 'host': '127.0.0.1', port: 5555 }
    ],
    facility: 'Node.js'
});

module.exports = logger;