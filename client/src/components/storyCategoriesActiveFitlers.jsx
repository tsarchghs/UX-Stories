import React from "react";
import {getActiveFilters} from "../helpers";

class StoryCategoriesActiveFitlers extends React.Component {
	render(){
		return (
			<div>
                {
                  getActiveFilters(this.props.state,"storyCategories").map(storyCategory => {
                      return (
                        <div className="ux-label ">
                          <p className="light-gray">
                            {!this.props.split ? storyCategory : storyCategory.split("_")[1]}
                          </p>
                          <span><p style={{ "cursor": "pointer" }}><img onClick={(e) => this.props.unFilter(e,storyCategory)} src="/assets/toolkit/images/008-delete.svg" alt /></p></span>
                        </div>  
                      );    
                  })                
                }
            </div>
		);
	}
}

export default StoryCategoriesActiveFitlers;