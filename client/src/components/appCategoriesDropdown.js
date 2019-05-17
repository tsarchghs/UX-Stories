import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import DropdownLoading from "./dropdownLoading";

class AppCategoriesDropdown extends React.Component {
	render(){
		return (
			<div className={`filter ${this.props.open ? "is-open" : ""}`} style={this.props.style} id={this.props.id} data-dropdown data-auto-focus="true">
	            <Query
	              query={gql`
	                query {
	                  appCategories{
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
	                    <h5 className="gray bold">Filter with categories</h5>
	                    <p className="pink">{this.props.filterBy.appCategory && (this.props.filterBy.appCategory !== "all") ? 1 : 0} selected</p>
	                  </div>
	                  <div className="filter-dropdown__main">
	                    {
	                      [{id:"all",name:"all"}].concat(data.appCategories).map(appCategory => {
													let identifier = this.props.use_name ? appCategory.name : appCategory.id
													let active = identifier == this.props.filterBy.appCategory;
	                        return (

	                          <label className={`radio-t rde ${active ? 'checked' : ''}`}>
															<label id={identifier+"_label"} className="gray bold">{appCategory.name}</label>
	                            <input 
	                              className="ic" 
	                              type="radio" 
	                              name={1}
	                              value={1}
																checked={active}
	                              onClick={(e) => this.props.handleFilterClick(e,appCategory)}
	                            />
	                            <span className="checkmark"/>
	                          </label>
	                        );
	                      })
	                    } 
	                  </div>
	                </div>

	              )
	            }}
	          </Query>
	        </div>  
		);
	}
}
export default AppCategoriesDropdown;