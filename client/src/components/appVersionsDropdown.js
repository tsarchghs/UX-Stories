import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import DropdownLoading from "./dropdownLoading";
import {getActiveFilters} from "../helpers";

class AppVersionsDropdown extends React.Component {
	render(){
		return (
			<div className="filter" id={this.props.id} data-dropdown data-auto-focus="true">
	            <Query 
	              query={gql`
		              query AppVersions (
										$app: ID
									){
		                appVersions(
											app: $app
										) {
		                  id
		                  name
		                }
		              }
								`}
								variables={{
									app: this.props.app
								}}
							>
	              { ({loading,error,data}) => {
	                if (error) return <p>{error.message}</p>
	                if (loading) return <DropdownLoading/>
	                return (
	                    <div className="filter-dropdown">
	                      <div className="filter-dropdown__top">
	                        <h5 className="gray bold">Filter with stories</h5>
													{
														!data.appVersions.length ? null 
														:<p className="pink">{getActiveFilters(this.props.state,"appVersions").length} selected</p>
													}	                      </div>
	                      <div className="filter-dropdown__main">                
														{
															!data.appVersions.length && <p>No relevant filters</p>
														}   
	                          {
	                            data.appVersions.map(appVersion => {
																console.log(appVersion)
	                              return (
																		<label className="radio-t rde">
																			<label id={appVersion.id+"_label"} className="gray bold">{appVersion.name}</label>
																			<input 
																				className="ic" 
																				type="radio" 
																				name={1}
																				value={1}
																				onClick={(e) => this.props.handleFilterClick(e,appVersion)}
																			/>
																			<span className="checkmark"/>
																	</label>
	                              );
	                            })
	                          }  
	                      </div>
	                  </div>
	                );
	              }}
	         
	         </Query>
	        </div>
		);
	}
}

export default AppVersionsDropdown;