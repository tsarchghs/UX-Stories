import React from "react";
import { Query } from "react-apollo";
import DropdownLoading from "./dropdownLoading";
import {getActiveFilters} from "../helpers";
import { STORY_CATEGORIES_QUERY } from "../Queries";

class StoryCategoriesDropdown extends React.Component {
	render(){
		return (
			<div className={`filter ${this.props.open ? "is-open" : ""}`} style={this.props.style}>
	            <Query 
					query={STORY_CATEGORIES_QUERY}
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
									let identifier = this.props.use_name ? storyCategory.name : storyCategory.id
									let active = this.props.filterBy.storyCategories[
										this.props.joinID  
										? `${storyCategory.id}_${storyCategory.name}`
										: identifier
									]
									return (
										<label className={`radio__container ${active ? 'checked' : ''}`}>
											<label className="gray bold">{storyCategory.name}</label>
											<input 
												className="ic" 
												type="checkbox"
												checked={active ? true : false}
												name={1}
												value={1}
												onChange={(e) => this.props.handleFilterClick(e,storyCategory)}
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