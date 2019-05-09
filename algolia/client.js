const algoliasearch = require("algoliasearch");
const configs = require("../configs");

const client = algoliasearch(
    'VEF3IFWRPG',
    configs.algolia_key
);

module.exports = client;