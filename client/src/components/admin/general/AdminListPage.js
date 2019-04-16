import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import Table from "./Table";

class AdminListPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			filterBy: [
				{
					key: "first",
					value_int: this.props.first
				}
			],
			where: []
		}
		this.update = debounce(this.update.bind(this));
		this.index_name_contains = undefined;
		this.search = undefined;
	}
	update(e) {
		this.setState(prevState => {
			let state = prevState;
			if (this.index_name_contains === undefined){
				this.index_name_contains = state.where.push({key:"name_contains",value_str:this.search.value}) - 1
			} else {
				state.where[this.index_name_contains].value_str = this.search.value;
			}
			console.log(state);
			return state;
		})
	}
	render(){
		return (
			<div>
		      <div className="dashboard-wrapper">
		        <div className="container-fluid dashboard-content">
		          <div className="row">
		            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		              <div className="page-header">
		                <h2 className="pageheader-title">Stories-elements </h2>
		                <p className="pageheader-text">Proin placerat ante duiullam scelerisque a velit ac porta, fusce sit amet vestibulum mi. Morbi lobortis pulvinar quam.</p>
		              </div>
		            </div>
		          </div>
		          <div className="page-header">
		            <div className="input-group col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
		              <input ref={node => this.search = node} onChange={this.update} type="text" className="form-control" placeholder="Search by name" />
		              <div className="input-group-append">
		                <button type="submit" className="btn btn-primary">Search</button>
		              </div>
		            </div>
		          </div>
		          <div className="row">
		            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		              <div className="card">
		                <div style={{marginTop: '20px', marginRight: '20px'}}>
		                <Link to="/admin/create_app_category/">
		                	<p className="btn btn-primary float-right">Add new app-category</p>
		                </Link>  
		                  <h5 className="card-header">List of all {this.props.typename}</h5>
		                </div>
						<Table 
		                	connection_type={this.props.connection_type}
		                	fields={this.props.fields}
		                	filterBy={this.state.filterBy}
		                	where={this.state.where}
		                />
		              </div>
		            </div>
		            {/* ============================================================== */}
		          </div>
		          {/* ============================================================== */}
		          {/* end main wrapper */}
		          {/* ============================================================== */}
		        </div>
		      </div>
		   </div>
		);
	}
}

export default AdminListPage;