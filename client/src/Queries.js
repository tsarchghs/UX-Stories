import gql from "graphql-tag";

const getObjectConnectionQuery = gql`
  query GetObjectConnection(
  	$connection_type: CONNECTION_TYPE!
  	$fields: [String!]!
  	$filterBy: [Dict!]
  	$where: [Dict!]
  ) {
    getObjectConnection(
		connection_type: $connection_type
		fields: $fields
		filterBy: $filterBy
		where: $where
    ) {
      id
      pageInfo{
        hasNextPage
      }
      nodes {
        repr
      }
    }
 }
`

const LIBRARIES_QUERY = gql`query {
    libraries {
        id
        name
        stories {
          thumbnail {
          url
        }
      }
    }
  }`

const APPS_QUERY = gql`
  query Apps(
    $appFilterInput: AppFilterInput 
  ) {
    apps(appFilterInput: $appFilterInput){
        id
        name
        description
        logo {
          id
          url
        }
        stories(first:3) {
          id
          thumbnail {
            id
            url
          }
        }
        appCategory {
          id
          name
        }
        company
      }
    }
`
const UPDATE_ALGOLIA_INDEX_QUERY = gql`
  mutation UpdateAlgoliaIndex(
    $indexName: String!
    $object_id: ID!
  ) {
     updateAlgoliaIndex(
       indexName: $indexName,
       object_id: $object_id
     ) {
       success
     }
  }
`

const DELETE_ALGOLIA_INDEX_QUERY = gql`
  mutation DeleteAlgoliaIndex(
    $indexName: String!
    $object_id: ID!
  ) {
     deleteAlgoliaIndex(
       indexName: $indexName,
       object_id: $object_id
     ) {
       success
     }
  }
`
const ADD_ALGOLIA_INDEX_QUERY = gql`
  mutation AddAlgoliaIndex(
    $indexName: String!
    $object_id: ID!
  ) {
     addAlgoliaIndex(
       indexName: $indexName,
       object_id: $object_id
     ) {
       success
     }
  }
`

export {
    getObjectConnectionQuery,
    LIBRARIES_QUERY,
    APPS_QUERY,
    UPDATE_ALGOLIA_INDEX_QUERY,
    DELETE_ALGOLIA_INDEX_QUERY,
    ADD_ALGOLIA_INDEX_QUERY
}