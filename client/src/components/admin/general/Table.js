import React from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { debounce } from "lodash";

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
      pageInfo{
        hasNextPage
      }
      nodes {
        repr
      }
    }
 }
`

class _Table extends React.Component {
	constructor(props){
		super(props);
		this.skipBy =  { 
			key: "skip",
			value_int: 0
		}
		this.refs = {}
		this.last_skip_value = undefined;
		this.deleted = 0;
		this.refetch = undefined
		this.passOnSearch = false;
	}
	render(){
		return (
		<Query 
        	query={getObjectConnectionQuery}
        	notifyOnNetworkStatusChange={false} // me kon false ska nevoj ekstra kod
        									   // per pagination mi shfaq trejat veq kur tvin pa loading kopmlet
        	fetchPolicy="no-cache" // mos me lon qita spo bohet si refresh diqka faqja mas eventit tpar qfardo koft
        	variables={{
        		connection_type: this.props.connection_type,
        		fields: this.props.fields.map(field => field.type ? field.type : field),
        		filterBy: this.props.filterBy.concat([this.skipBy]),
        		where: this.props.where
        	}}
        >
        	{ ({loading,error,data,fetchMore,refetch,networkStatus}) => {	
        		console.log(networkStatus,loading,data,555);
        		if (!this.refetch) {
        			this.refetch = refetch;
        		}
        		if (!this.passOnSearch){
	        		let onSearch = (val) => {
	        			let variables= {
			        		connection_type: this.props.connection_type,
			        		fields: this.props.fields.map(field => field.type ? field.type : field),
			        		filterBy: this.props.filterBy.concat([this.skipBy]),
			        		where: this.props.where
	    				};
	    				let getContainsItem = undefined;
	    				variables.where.map(item => item.key.indexOf("_contains") ? (getContainsItem = item) : null);
	    				getContainsItem.value_str = val
	    				console.log(variables);
	        			let results = fetchMore({
	        				variables,
	        				updateQuery: (prev, { fetchMoreResult }) => {
	        					return fetchMoreResult
	        				}
	        			})
	        		}
	        		let debounced = debounce(onSearch,250)
        			this.props.setOnSearch(debounced);
        			this.passOnSearch = true;
        		}
        		let onLoadMore = () => {
        			let objects = JSON.parse(data.getObjectConnection.nodes.repr);
        			let skipBy = {
        				key: "skip",
        				value_int: objects.length - this.deleted
        			};
        			this.last_skip_value = skipBy.value_int;
        			let variables= {
		        		connection_type: this.props.connection_type,
		        		fields: this.props.fields.map(field => field.type ? field.type : field),
		        		filterBy: this.props.filterBy.concat([skipBy]),
		        		where: this.props.where
    				}
        			let results = fetchMore({
        				variables,
            			updateQuery: (prev, { fetchMoreResult }) => {
            				let fetchMoreResultNodes = JSON.parse(fetchMoreResult.getObjectConnection.nodes.repr);
            				let prevNodes = JSON.parse(prev.getObjectConnection.nodes.repr)
            				let combined_nodes = prevNodes.concat(fetchMoreResultNodes);
            				fetchMoreResult.getObjectConnection.nodes.repr = JSON.stringify(combined_nodes);
            				return fetchMoreResult;
            			}
        			})
        		}
        		if (networkStatus < 7) return <h4>loading</h4>
        		if (error) return <p>{error.message}</p>
        		let objects = Object.keys(data).length ? JSON.parse(data.getObjectConnection.nodes.repr) : []
        		console.log(objects,networkStatus);
                return (
                	<div className="card-body">
                  <table className="table">
	                    <thead>
	                      <tr>
							{
	                        	this.props.fields.map(field => {
	                        		if (typeof(field) === "object"){
	                        			return <th scope="col">{field.show}</th>
	                        		}
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
			                      <tr id={object.id} ref={node => this.refs = Object.assign({[object.id]:node},this.refs)}>
			                      {
			                      	Object.keys(object).map(key => {
			                      		if (key === "id"){
			                      			return  <th scope="row">{object[key]}</th>
			                      		}
			                      		if (typeof(object[key]) === "object"){
			                      			return object[key].length !== undefined ?
			                      					<th>
					                      				<select className="form-control" id="input-select">
					                      					{
					                      						Object.keys(object[key]).length ? "" 
					                      						: <option>None</option>
					                      					}
															{
								                      			Object.keys(object[key]).map(child => {
								                      				return <option>{object[key][child].name}</option>
								                      			})
															}
					                      				</select>
					                      			</th>
				                      			:
				                      				<th scope="row">{object[key].name}</th>
			                      		}
			                      		return <td>{object[key]}</td>
			                      	})
			                      }
			                        <td><div className="dd-nodrag btn-group ml-auto">
			                            <button className="btn btn-sm btn-outline-light">Edit</button>
			                            <button className="btn btn-sm btn-outline-light">
				                            <Mutation 
				                            	mutation={gql`
				                            		mutation DeleteObject(
				                            			$delete_type: DELETE_TYPE!
				                            			$fields: [String!]
				                            			$id: ID! 
				                            		) {
				                            			deleteObject(
															delete_type: $delete_type
															fields: $fields
															id: $id
				                            			) {
				                            				repr
				                            			}
				                            		}
				                            `}>
				                            	{(deleteObject,{loading,error,data}) => {
													if (error) return <i style={{color:"red"}} className="far fa-trash-alt" />
				                              		let onClick = async () => {
				                              			if (loading) return;
				                              			try {	
					                              			let data = await deleteObject({
					                              				variables:{
					                              					delete_type: this.props.delete_type,
					                              					fields: ["id"],
					                              					id: object.id
					                              				}
					                              			})
					                              			this.deleted++;
				                              				// this.refs[object.id].innerHTML = ""
				                              				document.getElementById(object.id).innerHTML = "";	
				                              			} catch(e) {
				                              				console.log(e);
				                              			}

				                              			console.log(data);
				                              		}
				                              		return <i onClick={onClick} className="far fa-trash-alt" />
				                            	}}
				                            </Mutation>
			                            </button>
			                          </div></td>
			                      </tr>
	                    		)
	                    	})
	                    }
	                    </tbody>
	                    {
	                    	!objects.length && !loading && !(networkStatus < 7) ? <center><p>Nothing to show</p></center> : null
	                    }
	                  </table>
	                    {
	                    	!(networkStatus < 7) && !loading && Object.keys(data).length && !data.getObjectConnection.pageInfo.hasNextPage ? null
	                    	:  <center><p onClick={onLoadMore} style={{marginTop:3}} className="btn btn-primary">Load more</p></center>

	                    }
                	</div>
                )
        	}}
           </Query>
		);
	}
}

export default withApollo(_Table);