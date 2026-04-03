import React from "react";
import { Query } from "react-apollo";
import DropdownLoading from "./dropdownLoading";
import {getActiveFilters} from "../helpers";
import { STORY_ELEMENTS_QUERY } from "../Queries";

class StoryElementsDropdown extends React.Component {
	render(){
		return (
			<div className={`filter ${this.props.open ? "is-open" : ""}`} style={this.props.style} data-dropdown data-auto-focus="true">
	            <Query 
					query={STORY_ELEMENTS_QUERY}
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
	                        <h5 className="gray bold">Filter with elemens</h5>
							{
								!data.storyElements.length ? null
									: <p className="pink">{getActiveFilters(this.props.state, "storyElements").length} selected</p>
							}	                      
						</div>
	                      <div className="filter-dropdown__main">
							{
								!data.storyElements.length && <p>No relevant filters</p>
							} 
							{
								data.storyElements.map(storyElement => {
									let identifier = this.props.use_name ? storyElement.name : storyElement.id
									let active = this.props.joinID ?
										this.props.filterBy.storyElements[`${storyElement.id}_${storyElement.name}`]
										:
										this.props.filterBy.storyElements[identifier]
									return (
										<label className={`radio__container ${active ? 'checked' : ''}`}>
											<label id={identifier+"_label"} className="gray bold">{storyElement.name}</label>
											<input 
												className="ic" 
												type="checkbox" 
												id={identifier}
												checked={active ? true : false}
												name={1}
												value={1}
												onChange={(e) => this.props.handleFilterClick(e,storyElement)}
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

export default StoryElementsDropdown;