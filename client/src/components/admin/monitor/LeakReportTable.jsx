import React from "react";
import { GET_MEMWATCH_LEAK_SUBSCRIPTION } from "../../../Queries";
import { Subscription } from "react-apollo";

class LeakReportTable extends React.Component {
    constructor(props){
        super(props);
        this.leaks = [];
    }
    render(){
        return (
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4">
                <div className="card">
                    <div style={{ marginTop: "20px", marginRight: "20px" }}>
                    <h5 className="card-header">List of all detected leaks</h5>
                    </div>
                    <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Start</th>
                            <th scope="col">End</th>
                            <th scope="col">Growth</th>
                            <th scope="col">Reason</th>
                        </tr>
                        </thead>
                        <tbody>
                        <Subscription
                            subscription={GET_MEMWATCH_LEAK_SUBSCRIPTION}
                        >
                            {({ data, loading, error }) => {
                                if (loading) return loading;
                                if (error) return error.message;
                                let lastLeak = this.leaks[this.leaks.length - 1]
                                if (
                                    !lastLeak ||
                                    JSON.stringify(lastLeak) !== JSON.stringify(data.getMemwatchLeak)
                                ) {
                                    this.leaks.push(data.getMemwatchLeak);
                                }
                                return this.leaks.map((leak,i) => {
                                    return (
                                        <tr>
                                            <th scope="row">{i+1}</th>
                                            <td>{leak.start}</td>
                                            <td>{leak.end}</td>
                                            <td>{leak.growth}</td>
                                            <td>{leak.reason}</td>
                                        </tr>
                                    )
                                })
                            }}
                        </Subscription>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default LeakReportTable;
