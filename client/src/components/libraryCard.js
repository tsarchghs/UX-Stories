import React from "react";

class LibraryCard extends React.Component {
  render() {
    return (
        <div className="libraries-card">
          <div className="libraries-card__top">
            <h4 className="bold">{this.props.library.name}</h4>
            <div className="show-dropdown close">
              <img src="../../assets/toolkit/images/edit.svg" className="pop-ed" alt />
              <div className="edit-dropdown">
                <a href="#"><img src="../../assets/toolkit/images/edit-p.svg" alt /><p className="bold">Edit</p></a>
                <a href="#"><img src="../../assets/toolkit/images/edit-p.svg" alt /><p className="bold">Delete</p></a>
              </div>
            </div>
          </div>
          <div className="libraries-card__hero">
            <img src="../../assets/toolkit/images/bitmap2.jpg" alt />
            <img src="../../assets/toolkit/images/bitmap2.jpg" alt />
            <img src="../../assets/toolkit/images/bitmap2.jpg" alt />
            <span>+2</span>
          </div>
        </div>
      );
  }
}

export default LibraryCard;