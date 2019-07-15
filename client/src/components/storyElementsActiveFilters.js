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
                            {!this.props.split ? storyElement : storyElement.split("_")[1]}
                          </p>
                          <span><p style={{"cursor":"pointer"}}><img onClick={(e) => this.props.unFilter(e,storyElement)} src="/assets/toolkit/images/008-delete.svg" alt /></p></span>
                        </div>  
                      );    
                   })
              }
            </div>
		);
	}
}

export default StoryElementsActiveFilters;