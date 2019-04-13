import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import DropdownLoading from "./dropdownLoading";
import {getActiveFilters} from "../helpers";

class StoryElementsDropdown extends React.Component {
	render(){
		return (
			<div className="filter" id={this.props.id} data-dropdown data-auto-focus="true">
	            <Query 
	              query={gql`
		              query {
		                storyElements {
		                  id
		                  name
		                }
		              }
	            `}>
	              { ({loading,error,data}) => {
	                if (error) return <p>{error.message}</p>
	                if (loading) return <DropdownLoading/>
	                	console.log(data);
	                return (
	                    <div className="filter-dropdown">
	                      <div className="filter-dropdown__top">
	                        <h5 className="gray bold">Filter with elemens</h5>
	                        <p className="pink">{getActiveFilters(this.props.state,"storyElements").length} selected</p>
	                      </div>
	                      <div className="filter-dropdown__main">                
	                          {
	                            data.storyElements.map(storyElement => {
	                              return (
	                                <label className="radio__container">
	                                  <label id={storyElement.id+"_label"} className="gray bold">{storyElement.name}</label>
	                                  <input 
	                                    className="ic" 
	                                    type="checkbox" 
	                                    id={storyElement.id}
	                                    name={1}
	                                    value={1}
	                                    onClick={(e) => this.props.handleFilterClick(e,storyElement)}
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