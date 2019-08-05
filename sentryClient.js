const Sentry = require('@sentry/node');

// dsn https://59c807725b9f487089e9e220071ec522@sentry.io/1518199
Sentry.init({ dsn: process.env.sentry_dsn });

module.exports = Sentry