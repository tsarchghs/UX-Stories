import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";

class Stories extends React.Component {
	render(){
		return (
			<div>
		        <Header/>
		        <LeftSidebar/>
		        <AdminListPage
		          typename="story"
		          typename_plural="stories"
		          connection_type="storiesConnection"
		          fields={[
		                "id",
		                { 
		                  type:"app { id name }",
		                  show:"app",
		              	},
		                { 
		                  type:"appVersions { id name }",
		                  show:"app versions"
		                },
						{ 
		                  type:"storyCategories { id name }",
		                  show:"story categories"
		                },
		                {
		                	type:"storyElements { id name }",
		                	show:"story elements"
		                }
		              ]}
		          first={5}
		        />
	       </div>
		);
	}
}

export default Stories;