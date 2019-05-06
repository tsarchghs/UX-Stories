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

export {
    getObjectConnectionQuery
}