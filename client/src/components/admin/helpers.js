import apolloClient from "../../apolloClient";

const algoliaSync = (obj_id,index_name,gql_) => {
    apolloClient.mutate({
      mutation: gql_,
      variables: {
        indexName: index_name,
        object_id: obj_id
      }
    })
}

export {
    algoliaSync
}