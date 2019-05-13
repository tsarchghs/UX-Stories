import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Query } from "react-apollo";
import gql from "graphql-tag";

class Dashboard extends React.Component {
	render(){
		return (
			<div>
				<Header user={this.props.user} />
				<LeftSidebar/>
		      <div className="dashboard-wrapper">
		        <div className="container-fluid dashboard-content">
		          <div className="row">
		            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		              <div className="page-header">
		                <h2 className="pageheader-title">Dashboard </h2>
		                <div className="page-header">
		                </div>
		                <div className="row">
		                  {/* ============================================================== */}
		                  {/* four widgets   */}
		                  {/* ============================================================== */}
		                  {/* ============================================================== */}
		                  {/* total views   */}
		                  {/* ============================================================== */}
		                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
		                    <div className="card">
		                      <div className="card-body">
		                        <div className="d-inline-block">
		                          <h5 className="text-muted">Total Apps</h5>
		                          <Query 
		                          	query={gql`
										query {
											countApps
										}
		                          `}>
		                          	{ ({loading,error,data}) => {
		                          		if (loading) return <p>-</p>
		                          		if (error) return <p>{error.message}</p>
		                          		return (
		                          			<h2 className="mb-0">{data.countApps}</h2>
		                          		)
		                          	}}
		                          </Query>
		                        </div>
		                        <div className="float-right icon-circle-medium  icon-box-lg  bg-info-light mt-1">
		                          <i className="fas fa-mobile-alt fa-fw fa-sm text-info" />
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		                  {/* ============================================================== */}
		                  {/* end total views   */}
		                  {/* ============================================================== */}
		                  {/* ============================================================== */}
		                  {/* total followers   */}
		                  {/* ============================================================== */}
		                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
		                    <div className="card">
		                      <div className="card-body">
		                        <div className="d-inline-block">
		                          <h5 className="text-muted">Total Stories</h5>
		                          <Query 
		                          	query={gql`
										query {
											countStories
										}
		                          `}>
		                          	{ ({loading,error,data}) => {
		                          		if (loading) return <p>-</p>
		                          		if (error) return <p>{error.message}</p>
		                          		return (
		                          			<h2 className="mb-0">{data.countStories}</h2>
		                          		)
		                          	}}
		                          </Query>
		                        </div>
		                        <div className="float-right icon-circle-medium  icon-box-lg  bg-primary-light mt-1">
		                          <i className="fas fa-video fa-fw fa-sm text-primary" />
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		                  {/* ============================================================== */}
		                  {/* end total followers   */}
		                  {/* ============================================================== */}
		                  {/* ============================================================== */}
		                  {/* partnerships   */}
		                  {/* ============================================================== */}
		                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
		                    <div className="card">
		                      <div className="card-body">
		                        <div className="d-inline-block">
		                          <h5 className="text-muted">All Users</h5>
		                          <Query 
		                          	query={gql`
										query {
											countUsers
										}
		                          `}>
		                          	{ ({loading,error,data}) => {
		                          		if (loading) return <p>-</p>
		                          		if (error) return <p>{error.message}</p>
		                          		return (
		                          			<h2 className="mb-0">{data.countUsers}</h2>
		                          		)
		                          	}}
		                          </Query>		                        </div>
		                        <div className="float-right icon-circle-medium  icon-box-lg  bg-secondary-light mt-1">
		                          <i className="fa fa-user fa-fw fa-sm text-secondary" />
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		                  {/* ============================================================== */}
		                  {/* end partnerships   */}
		                  {/* ============================================================== */}
		                  {/* ============================================================== */}
		                  {/* total earned   */}
		                  {/* ============================================================== */}
		                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
		                    <div className="card">
		                      <div className="card-body">
		                        <div className="d-inline-block">
		                          <h5 className="text-muted">Subscribed users</h5>
		                          <h2 className="mb-0"> 23</h2>
		                        </div>
		                        <div className="float-right icon-circle-medium  icon-box-lg  bg-brand-light mt-1">
		                          <i className="fa fa-handshake fa-fw fa-sm text-brand" />
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		                  {/* ============================================================== */}
		                  {/* end total earned   */}
		                  {/* ============================================================== */}
		                </div>
		              </div>
		              {/* ============================================================== */}
		            </div>
		          </div>
		        </div>
		      </div>
			</div>
		);
	}
}

export default Dashboard;