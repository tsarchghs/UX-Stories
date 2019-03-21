import React from "react";

class Home extends React.Component {
  render() {
    return (
      <div>
        <div className="secondary-header">
          <div className="container">
            <div className="secodary-header__content">
              <div className="flex  ac">
                <h2 className="white">Browse Stories</h2>
                <span className="seperator" />
                <div className="search">
                  <img src="/assets/toolkit/images/search-icon.svg" alt />
                  <input type="text" placeholder="Search by app name..." />
                </div>      </div>
              <div className="flex">
                <div className="filter">
                  <button className="button white">Filter with Categories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                </div>        <div className="filter">
                  <button className="button white">Filter with Stories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                </div>        <div className="filter">
                  <button className="button white">Filter with Elements<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                </div>      </div>
            </div>
          </div>
        </div>
        <div className="results">
          <div className="container">
            <div className="results__content">
              <p className="results__results bold">Showing 6 Results</p>
              <div className="ux-label ">
                <p className="light-gray">Social networking</p>
                <span><img src="/assets/toolkit/images/008-delete.svg" alt /></span>
              </div>      <div className="ux-label ">
                <p className="light-gray">Social networking</p>
                <span><img src="/assets/toolkit/images/008-delete.svg" alt /></span>
              </div>      <div className="ux-label ">
                <p className="light-gray">Social networking</p>
                <span><img src="/assets/toolkit/images/008-delete.svg" alt /></span>
              </div>      <p className="pink"><a href="#">Clear all filters</a></p>
            </div>
          </div>
        </div><div className="cards">
          <div className="container">
            <div className="cards__content">
              <a href="#"><img src="../../assets/toolkit/images/bitmap.jpg" alt /></a>
              <a href="#"><img src="../../assets/toolkit/images/bitmap.jpg" alt /></a>
              <a href="#"><img src="../../assets/toolkit/images/bitmap.jpg" alt /></a>
              <a href="#"><img src="../../assets/toolkit/images/bitmap.jpg" alt /></a>
              <a href="#"><img src="../../assets/toolkit/images/bitmap.jpg" alt /></a>
              <a href="#"><img src="../../assets/toolkit/images/bitmap.jpg" alt /></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Home;