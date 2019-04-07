import React from "react";

class SingleStoryAppLoading extends React.Component {
	render(){
		return (
			<div className="apps__top">
		        <div className="apps__top-image" style={{backgroundImage: 'url("https://www.colorhexa.com/a9a9a9.png")'}} />
		        <div className="apps__top-info">
		          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAARCAYAAAChIpBnAAAAYklEQVRYR+3SsQ0AIAgFUR2QadmNVhMTHECvPHquePmzqlZmDu9dICLO8xTzHbE/xfw3vAUxxQQFwJTLFBMUAFMuU0xQAEy5TDFBATDlMsUEBcCUyxQTFABTLlNMUABM9TI3MRJ1A54Q7i4AAAAASUVORK5CYII=" />
		          <br /><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATAAAAAKCAYAAAAzbQKMAAAAaklEQVRoQ+3UAQkAMAwDwdW/kqrcYC4ergrCpWR29x5HgACBoMAYsGBrIhMg8AUMmEcgQCArYMCy1QlOgIAB8wMECGQFDFi2OsEJEDBgfoAAgayAActWJzgBAgbMDxAgkBUwYNnqBCdA4AFXaB3PT+97ZgAAAABJRU5ErkJggg==" />
		        </div>
	      	</div>
		);
	}
}

export default SingleStoryAppLoading;