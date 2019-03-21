import React from "react";

class Library extends React.Component {
	render() {
		return (
	      <div>
	        <div className="header back__header">
	          <div className="container">
	            <div className="header__content">
	              <div className="logo">
	                <a href="#"><img src="/assets/toolkit/images/logo.svg" alt /></a>
	              </div>				<h4 className="pink bold header__back"><a href="#" className="flex ac"><img src="../../assets/toolkit/images/008-delete.svg" alt />Back to profile</a></h4>
	              <div className="profile-nav">
	                <p className="light-gray"><a href="#">Upgrade</a></p>
	                <a href="#" className="profile-nav__img" style={{backgroundImage: 'url("https://scontent.fprn1-1.fna.fbcdn.net/v/t1.0-1/p160x160/35988964_1041356179350456_5301902918050381824_n.jpg?_nc_cat=105&_nc_ht=scontent.fprn1-1.fna&oh=2142e132de1a494501a3fc90d51e365c&oe=5D4FB1D7")'}} />
	              </div>
	            </div>
	          </div>
	        </div>
	        <div className="container">
	          <div className="secodary-header__content">
	            <div className="colored">
	              <div className="flex ac">
	                <h2 className="white">First library</h2>
	              </div>
	              <div className="flex ac">
	                <a href="#"><img src="../../assets/toolkit/images/edit.svg" alt /></a>
	                <div className="filter">
	                  <button className="button white">Filter with Categories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
	                </div>				<div className="filter">
	                  <button className="button white">Filter with Stories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
	                </div>			</div>
	            </div>
	          </div>
	        </div>
	        <div className="cards">
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
}

export default Library;