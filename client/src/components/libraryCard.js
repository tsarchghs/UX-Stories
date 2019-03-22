import React from "react";
import { Link } from "react-router-dom";

class LibraryCard extends React.Component {
  render() {
    return (
        <div className="libraries-card">
          <div className="libraries-card__top">
            <Link to={`/library/${this.props.library.id}`}><h4 className="bold">{this.props.library.name}</h4></Link>
            <div className="show-dropdown close">
              <img src="../../assets/toolkit/images/edit.svg" className="pop-ed" alt />
              <div className="edit-dropdown">
                <a href="#"><img src="../../assets/toolkit/images/edit-p.svg" alt /><p className="bold">Edit</p></a>
                <a href="#"><img src="../../assets/toolkit/images/edit-p.svg" alt /><p className="bold">Delete</p></a>
              </div>
            </div>
          </div>
          <div className="libraries-card__hero">
          {
            // checks if there are more or equal stories to 4 if yes it slices it if not it doesn't
            (this.props.library.stories.length - 4 < 0 ? this.props.library.stories : this.props.library.stories.slice(this.props.library.stories.length - 4)).map(story => {
              return (
                                          <Link to={`/library/${this.props.library.id}`}><img src={story.thumbnail.url} alt style={{width:60,height:150}} /> </Link>
              ); 
            })
          }
            {
              this.props.library.stories.length > 4 ? <span>+{this.props.library.stories.length - 4}</span> : ""
            }
            {
              this.props.library.stories.length === 0 ? "This library is empty" : ""
            }
          </div>
        </div>
      );
  }
}

export default LibraryCard;