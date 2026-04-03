import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link, withRouter } from "../../../lib/routerCompat";
import { debounce } from "lodash";
import Table from "./Table";
import CreateObject from "./CreateObject";

class AdminListPage extends React.Component {
	constructor(props){
		super(props);
		if (this.props.location){
			console.log(this.props.location.state)
		}
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
			],
			onSearch: undefined,
			refetchTable: undefined
		}
		this.skipBy = {
			key: "skip",
			value_int: 0
		}
		this.update = debounce(this.update.bind(this),150);
		this.setOnSearch = this.setOnSearch.bind(this);
		this.search = undefined;
		this.refetch = undefined;
	}
	update(e) {
		this.setState(prevState => {
			let state = prevState;
			state.where[0].value_str = this.search.value;
			return state;
		});
	}
	setOnSearch(onSearch){
		this.setState({onSearch})
	}
	render(){
		let create_url = this.props.location.pathname + "#create";
		let showCreate = this.props.location.hash === "#create"

		let showFields = []
		this.props.fields.map(field => !field.hideTable ? showFields.push(field) : null);
		let get_obj_connection_variables = {
			connection_type: this.props.connection_type,
			fields: showFields.map(field => field.fetch ? field.fetch : field),
			filterBy: this.state.filterBy.concat([this.skipBy]),
			where: this.state.where
		}

		return (
			<div>
		      <div className="dashboard-wrapper">
		        <div className="container-fluid dashboard-content">
					<div className="row">
					{
						!showCreate ? null
						: <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
			                <div className="page-header">
			                  <h2 className="pageheader-title">{`Create new ${this.props.typename}`}</h2>
			                  <div className="page-breadcrumb">
			                    <nav aria-label="breadcrumb">
			                      <ol className="breadcrumb">
			                        <li className="breadcrumb-item">
			                        <Link to={this.props.location.pathname}>
			                        	<p className="breadcrumb-link">{this.props.typename_plural}</p>
			                        </Link>	
			                        </li>

			                        <li className="breadcrumb-item active" aria-current="page">{`Create new ${this.props.typename}`}</li>
			                      </ol>
			                    </nav>
			                  </div>
			                </div>
			              </div>
					}
		            </div>
		        {
		        	showCreate ? null 
		        	:  <div style={{marginTop:60}} className="page-header">
			            <div className="input-group col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
			              <input ref={node => this.search = node} onChange={(e) => this.state.onSearch(e.target.value)} type="text" className="form-control" placeholder={`Search by ${this.props.search_by_show ? this.props.search_by_show : "name" }`} />
			              <div className="input-group-append">
			           	     <button type="submit" className="btn btn-primary">Search</button>
			              </div>
			            </div>
			          </div>
		        }
		          <div className="row">
		            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		              <div className={showCreate ? null : "card"}>
		                <div style={{marginTop: '20px', marginRight: '20px'}}>
		                {
		                	showCreate ? null
		                	: <Link to={create_url}>
			                	<p className="btn btn-primary float-right">Add new {this.props.typename}</p>
			                </Link>  
		                }
		                {
		                	showCreate
		                	? null // <Link to={`/admin/${this.props.typename_plural}`}><h6 style={{color:"blue"}}>Go back to {this.props.typename_plural}</h6></Link> 
		                  	: <h5 className="card-header">List of all {this.props.typename_plural}</h5>
		                }
		                </div>
		                {
		                	showCreate
		                	? <CreateObject 
								get_obj_connection_variables={get_obj_connection_variables}
		                		fields={this.props.fields}
		                		typename={this.props.typename}
		                		location={this.props.location}
		                		typename={this.props.typename}
		                		mutation_type={this.props.mutation_type}
								afterCreate={this.props.afterCreate}
		                	/>
		                	: <Table 
			                	connection_type={this.props.connection_type}
								get_obj_connection_variables={get_obj_connection_variables}
								skipBy={this.skipBy}
			                	fields={this.props.fields}
			                	filterBy={this.state.filterBy}
			                	where={this.state.where}
			                	delete_type={this.props.delete_type}
								deleteObjectFields={this.props.deleteObjectFields}
			                	first={this.props.first}
								typename_url_friendly={this.props.typename_url_friendly}
			                	setOnSearch={this.setOnSearch}
								afterDelete={this.props.afterDelete}
			                />
		                }
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

export default withRouter(AdminListPage);
