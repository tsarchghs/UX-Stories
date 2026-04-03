const algoliasearch = require("algoliasearch");
const configs = require("../configs");

const client = algoliasearch(
    'NTZEWWQ1TV',
    configs.algolia_key
);

module.exports = client;
