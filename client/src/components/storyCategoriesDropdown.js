import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import DropdownLoading from "./dropdownLoading";
import {getActiveFilters} from "../helpers";

class StoryCategoriesDropdown extends React.Component {
	render(){
		return (
			<div className="filter" id={this.props.id} data-dropdown data-auto-focus="true">
	            <Query 
	              query={gql`
		              query {
		                storyCategories {
		                  id
		                  name
		                }
		              }
	            `}>
	              { ({loading,error,data}) => {
	                if (error) return <p>{error.message}</p>
	                if (loading) return <DropdownLoading/>
	                return (
	                    <div className="filter-dropdown">
	                      <div className="filter-dropdown__top">
	                        <h5 className="gray bold">Filter with stories</h5>
	                        <p className="pink">{getActiveFilters(this.props.state,"storyCategories").length} selected</p>
	                      </div>
	                      <div className="filter-dropdown__main">                
	                          {
	                            data.storyCategories.map(storyCategory => {
	                              return (
	                                <label className="radio__container">
	                                  <label id={storyCategory.id+"_label"} className="gray bold">{storyCategory.name}</label>
	                                  <input 
	                                    className="ic" 
	                                    type="checkbox" 
	                                    name={1}
	                                    value={1}
	                                    onClick={(e) => this.props.handleFilterClick(e,storyCategory)}
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