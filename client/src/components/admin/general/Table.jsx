import React from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { getObjectConnectionQuery } from "../../../Queries";

class _Table extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false
		}
		this.refs = {}
		this.last_skip_value = undefined;
		this.deleted = 0;
		this.passOnSearch = false;
	}
	render(){
		let showFields = []
		this.props.fields.map(field => !field.hideTable ? showFields.push(field) : null);
		return (
		<Query 
        	query={getObjectConnectionQuery}
			variables={this.props.get_obj_connection_variables}
        >
        	{ ({loading,error,data,fetchMore,refetch,networkStatus,updateQuery}) => {	
				if (this.state.loading) loading = true;
        		if (!this.passOnSearch){
	        		let onSearch = (val) => {
						this.setState({loading:true})
	        			let variables= {
			        		connection_type: this.props.connection_type,
			        		fields: showFields.map(field => field.fetch ? field.fetch : field),
			        		filterBy: this.props.filterBy.concat([this.props.skipBy]),
			        		where: this.props.where
	    				};
	    				let getContainsItem = undefined;
	    				variables.where.map(item => item.key.indexOf("_contains") ? (getContainsItem = item) : null);
	    				getContainsItem.value_str = val
	        			if (!val){
							this.setState({ loading: false })	    
	        				refetch(variables); // :'(
	        				return;
	        			}
	    				try {
	    						let objs = this.props.client.readQuery({
	    							query: getObjectConnectionQuery,
	    							variables
	    						})
	    						updateQuery((prev, options) => {
									this.setState({ loading: false })	    							
									return objs
	    						})
	    						return;
	    				} catch (e){
								console.log(e);
	    				}
	        			let results = fetchMore({
	        				variables,
	        				updateQuery: (prev, { fetchMoreResult }) => {
	        					this.props.client.writeQuery({
	        						query: getObjectConnectionQuery,
	        						variables,
	        						data: fetchMoreResult
	        					})
								this.setState({ loading: false })	    
	        					return fetchMoreResult
	        				}
	        			})
	        		}
	        		let debounced = debounce(onSearch,250)
        			this.props.setOnSearch(debounced);
        			this.passOnSearch = true;
        		}
        		let onLoadMore = () => {
					console.log(this.loading,919)
					if (this.loading) return;
					this.loading = true;
        			let objects = JSON.parse(data.getObjectConnection.nodes.repr);
        			let skipBy = {
        				key: "skip",
        				value_int: objects.length - this.deleted
        			};
        			this.last_skip_value = skipBy.value_int;
        			let variables= {
		        		connection_type: this.props.connection_type,
		        		fields: showFields.map(field => field.fetch ? field.fetch : field),
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
							this.loading = false;
            				return fetchMoreResult;
            			}
        			})
        		}
        		if (loading && networkStatus !== 3) return <h4>loading</h4>
        		if (error) return <p>{error.message}</p>
        		let objects = Object.keys(data).length ? JSON.parse(data.getObjectConnection.nodes.repr) : []
                return (
                	<div className="card-body">
                  <table className="table">
	                    <thead>
	                      <tr>
							{
	                        	showFields.map(field => {
	                        		if (field.hideTable) return;
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
										  console.log(key)
			                      		if (key === "id"){
			                      			return  <th scope="row">{object[key]}</th>
			                      		}
																if (object[key].url){
																	return (
																		<img src={object[key].url}></img>
																	)
																}
			                      		if (typeof(object[key]) === "object" && !object[key].primitive){
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
															<Link to={{
																pathname:`/admin/${this.props.typename_url_friendly}/${object.id}`,
																state:{
																	variables: this.props.get_obj_connection_variables
																}	
															}}>
			                            <button className="btn btn-sm btn-outline-light">Edit</button>
															</Link>
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
													if (error) {
														alert(error.message);
														return (
					                              			<button className="btn btn-sm btn-outline-light">
					                              				<i style={{color:"red"}} className="far fa-trash-alt" />
				                            				</button>
														)
													}
				                              		let onClick = async () => {
				                              			if (loading) return;
																						let verification = prompt("Type 'DELETE' to delete");
																						if (verification !== "DELETE") return;
				                              			try {	
					                              			let data = await deleteObject({
					                              				variables:{
					                              					delete_type: this.props.delete_type,
					                              					fields: this.props.deleteObjectFields ||  ["id"],
					                              					id: object.id
					                              				}
					                              			})
																							if (this.props.afterDelete){
																								console.log(object.id,"ID");
																								this.props.afterDelete(object.id,data);
																							}
					                              			this.deleted++;
				                              				// this.refs[object.id].innerHTML = ""
				                              				document.getElementById(object.id).innerHTML = "";	
				                              			} catch(e) {
				                              				console.log(e);
				                              			}
				                              		}
				                              		return (
				                              			<button onClick={onClick} className="btn btn-sm btn-outline-light">
				                              				<i className="far fa-trash-alt" />
			                            				</button>
			                            			);
				                            	}}
				                            </Mutation>
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