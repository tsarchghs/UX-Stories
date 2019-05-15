import React from "react";
import AppProfileLoading from "./appProfileLoading";
import StoryThumbnailLoading from "./storyThumbnailLoading";
import CategoriesLoading from "./categoriesLoading";

class SingleAppLoading extends React.Component {
	render(){
		return (
            <div className="container">
          		<div className="flex">
		            <AppProfileLoading/>
		            <div>
		              <div className="container">
		                <div className="secodary-header__content">
		                  <CategoriesLoading/>
		                </div>
		              </div>
              <div className="cards">
                <div className="container">
			      <div style={{paddingTop:0,marginLeft:13}} className="results__content">
			        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAAQCAYAAADQ3cuiAAAAVklEQVRoQ+3VAQkAMAzEwNW/2TrYYDZydZCEp7O797icgRE+1/wDC9/sLny0u/DCVw1Euf144aMGotgWL3zUQBTb4oWPGohiW7zwUQNRbIsXPmogiv0AlDI9AX2aFTAAAAAASUVORK5CYII=" />
			        <br />
			      </div>
                  <div className="cards__content">
									<center>
                            <StoryThumbnailLoading/><StoryThumbnailLoading/><StoryThumbnailLoading/><StoryThumbnailLoading/>
                            <StoryThumbnailLoading/><StoryThumbnailLoading/>
									</center>
                  </div>
                </div>
              </div>

		              </div>
		            </div>
		         </div>
		);
	}
}

export default SingleAppLoading;