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
                          <p className="light-gray">{document.getElementById(storyCategory+"_label").innerHTML}</p>
                          <span><a href="#"><img onClick={(e) => this.props.unFilter(e,storyCategory)} src="/assets/toolkit/images/008-delete.svg" alt /></a></span>
                        </div>  
                      );    
                  })                
                }
            </div>
		);
	}
}

export default StoryCategoriesActiveFitlers;