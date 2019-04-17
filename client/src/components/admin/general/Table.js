import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { debounce } from "lodash";

class Table extends React.Component {
	constructor(props){
		super(props);
		this.skipBy =  { 
			key: "skip",
			value_int: 0
		}
		this.refetch = undefined
	}
	componentDidUpdate(){
		this.refetch();
	}
	render(){
		return (
		<Query 
        	query={gql`
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
				      pageInfo{
				        hasNextPage
				      }
				      nodes {
				        repr
				      }
				    }
				 }
        	`}
        	notifyOnNetworkStatusChange={true}
        	fetchPolicy="no-cache"
        	variables={{
        		connection_type: this.props.connection_type,
        		fields: this.props.fields,
        		filterBy: this.props.filterBy,
        		where: this.props.where
        	}}
        >
        	{ ({loading,error,data,fetchMore,refetch,networkStatus}) => {
        		if (!this.refetch) {
        			this.refetch = debounce(refetch,250);
        		}
        		let onLoadMore = () => {
        			let objects = JSON.parse(data.getObjectConnection.nodes.repr);
        			let skipBy = {
        				key: "skip",
        				value_int: objects.length
        			};

        			let results = fetchMore({
        				variables: {
			        		connection_type: this.props.connection_type,
			        		fields: this.props.fields,
			        		filterBy: this.props.filterBy.concat([skipBy]),
			        		where: this.props.where
        				},
            			updateQuery: (prev, { fetchMoreResult }) => {
            				let fetchMoreResultNodes = JSON.parse(fetchMoreResult.getObjectConnection.nodes.repr);
            				let prevNodes = JSON.parse(prev.getObjectConnection.nodes.repr)
            				let combined_nodes = prevNodes.concat(fetchMoreResultNodes);
            				fetchMoreResult.getObjectConnection.nodes.repr = JSON.stringify(combined_nodes);
            				return fetchMoreResult;
            			}
        			})
        		}
        		if (loading && networkStatus !== 3) return <h4>loading</h4>
        			console.log(networkStatus );
        		if (error) return <p>{error.message}</p>
        		let objects = Object.keys(data).length ? JSON.parse(data.getObjectConnection.nodes.repr) : []
        		console.log(objects);
                return (
                	<div className="card-body">
	                  <table className="table">
	                    <thead>
	                      <tr>
							{
	                        	this.props.fields.map(field => {
	                        		return <th scope="col">{field === "id" ? "#" : field}</th>
	                        	})
	                        }
	                        <th scope="col"> </th>
	                      </tr>
	                    </thead>
	                    <tbody>
	                    {
	                    	objects.map(object => {
	                    		return (
			                      <tr>
			                      {
			                      	Object.keys(object).map(key => {
			                      		if (key === "id"){
			                      			return  <th scope="row">{object[key]}</th>
			                      		}
			                      		return <td>{object[key]}</td>
			                      	})
			                      }
			                        <td><div className="dd-nodrag btn-group ml-auto">
			                            <button className="btn btn-sm btn-outline-light">Edit</button>
			                            <button className="btn btn-sm btn-outline-light">
			                              <i className="far fa-trash-alt" />
			                            </button>
			                          </div></td>
			                      </tr>
	                    		)
	                    	})
	                    }
	                    </tbody>
	                    {
	                    	!objects.length && !loading && !(networkStatus === 3) ? <center><p>Nothing to show</p></center> : null
	                    }
	                  </table>
	                    {
	                    	!(networkStatus === 3) && !loading && Object.keys(data).length && !data.getObjectConnection.pageInfo.hasNextPage ? null
	                    	:  <center><p onClick={onLoadMore} style={{marginTop:3}} className="btn btn-primary">Load more</p></center>

	                    }
                	</div>
                )
        	}}
           </Query>
		);
	}
}

export default Table;