import React from "react";
import {getActiveFilters} from "../helpers";

class StoryElementsActiveFilters extends React.Component {
	render(){
		return (
			     <div>
                {
                  getActiveFilters(this.props.state,"storyElements").map(storyElement => {
                      return (
                        <div className="ux-label ">
                          <p className="light-gray">
                            {this.props.is_name ? storyElement : document.getElementById(storyElement+"_label") && document.getElementById(storyElement+"_label").innerHTML}}
                          </p>
                          <span><a href="#"><img onClick={(e) => this.props.unFilter(e,storyElement)} src="/assets/toolkit/images/008-delete.svg" alt /></a></span>
                        </div>  
                      );    
                   })
              }
            </div>
		);
	}
}

export default StoryElementsActiveFilters;