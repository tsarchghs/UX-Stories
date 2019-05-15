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
export {
    getObjectConnectionQuery,
    LIBRARIES_QUERY,
    APPS_QUERY
}