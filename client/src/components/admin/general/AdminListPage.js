import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import Table from "./Table";
import uuidv1 from 'uuid/v1';

class AdminListPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			filterBy: [
				{
					key: "first",
					value_int: this.props.first
				},
				{
					key: "orderBy",
					value_str: "createdAt_DESC"
				}			
			],
			where: [
				{
					key: this.props.search_by,
					value_str: ""
				}
			]
		}
		this.update = debounce(this.update.bind(this),150);
		this.setRefetch = this.setRefetch.bind(this);
		this.search = undefined;
		this.refetch = undefined;
	}
	update(e) {
		this.setState(prevState => {
			let state = prevState;
			state.where[0].value_str = this.search.value;
			return state;
		},this.refetch);
	}
	setRefetch(refetch){
		console.log(this.refetch);
		this.refetch = refetch;
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
		              <input ref={node => this.search = node} onChange={this.update} type="text" className="form-control" placeholder={`Search by ${this.props.search_by_show ? this.props.search_by_show : "name" }`} />
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
		                	<p className="btn btn-primary float-right">Add new {this.props.typename}</p>
		                </Link>  
		                  <h5 className="card-header">List of all {this.props.typename_plural}</h5>
		                </div>
						<Table 
		                	connection_type={this.props.connection_type}
		                	fields={this.props.fields}
		                	filterBy={this.state.filterBy}
		                	where={this.state.where}
		                	delete_type={this.props.delete_type}
		                	first={this.props.first}
		                	setRefetch={this.setRefetch}
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