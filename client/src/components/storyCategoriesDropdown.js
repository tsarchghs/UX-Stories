import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import DropdownLoading from "./dropdownLoading";
import {getActiveFilters} from "../helpers";

class StoryCategoriesDropdown extends React.Component {
	render(){
		return (
			<div className={`filter ${this.props.open ? "is-open" : ""}`} style={this.props.style} id={this.props.id} data-dropdown data-auto-focus="true">
	            <Query 
	              query={gql`
		              query StoryCategories (
										$app: ID
										$library: ID
									){
		                storyCategories(
											app: $app
											library: $library
										) {
		                  id
		                  name
		                }
		              }
								`}
									fetchPolicy={this.props.fetchPolicy ? this.props.fetchPolicy : "cache-first"}
									variables={{
										app: this.props.app,
										library: this.props.library
									}}
							>
	              { ({loading,error,data}) => {
	                if (error) return <p>{error.message}</p>
									if (loading || !Object.keys(data).length) return <DropdownLoading />
	                return (
	                    <div className="filter-dropdown">
	                      <div className="filter-dropdown__top">
	                        <h5 className="gray bold">Filter with stories</h5>
													{
														loading ? null 
														:<p className="pink">{getActiveFilters(this.props.state,"storyCategories").length} selected</p>
													}
	                      </div>
	                      <div className="filter-dropdown__main">                
												{
													!loading && data.storyCategories && !data.storyCategories.length && <p>No relevant filters</p>
												}   
	                          {
	                            data.storyCategories.map(storyCategory => {
																console.log(this.props.filterBy,555);
																let active = this.props.filterBy.storyCategories[storyCategory.id]
	                              return (
																	<label className={`radio__container ${active ? 'checked' : ''}`}>
	                                  <label id={storyCategory.id+"_label"} className="gray bold">{storyCategory.name}</label>
	                                  <input 
	                                    className="ic" 
	                                    type="checkbox"
	                                    id={storyCategory.id}
																			checked={active}
	                                    name={1}
	                                    value={1}
	                                    onClick={(e) => {e.preventDefault();this.props.handleFilterClick(e,storyCategory)}}
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

export default StoryCategoriesDropdown;