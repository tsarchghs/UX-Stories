import React from "react";
import { GET_MEMWATCH_STATS_SUBSCRIPTION } from "../../../Queries";
import { Subscription } from "react-apollo";

class StatsReportTable extends React.Component {
    constructor(props){
        super(props);
        this.stats = [];
    }
    render(){
        return (
            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8">
                <div className="card">
                    <div style={{ marginTop: "20px", marginRight: "20px" }}>
                    <h5 className="card-header">List of all reported stats</h5>
                    </div>
                    <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">num_full_gc</th>
                            <th scope="col">num_inc_gc</th>
                            <th scope="col">heap_compactions</th>
                            <th scope="col">estimated_base</th>
                            <th scope="col">current_base</th>
                            <th scope="col">min</th>
                            <th scope="col">max</th>
                            <th scope="col">usage_trend</th>
                        </tr>
                        </thead>
                        <tbody>
                        <Subscription
                            subscription={GET_MEMWATCH_STATS_SUBSCRIPTION}
                        >
                            {({ data, loading, error }) => {
                                if (loading) return loading;
                                if (error) return error.message;
                                let lastStat = this.stats[this.stats.length - 1]
                                if (
                                    !lastStat ||
                                    JSON.stringify(lastStat) !== JSON.stringify(data.getMemwatchStats)
                                ) {
                                    this.stats.push(data.getMemwatchStats);
                                }
                                return this.stats.map((stat,i) => {
                                    return (
                                        <tr>
                                            <th scope="row">{i+1}</th>
                                            <td>{stat.num_full_gc}</td>
                                            <td>{stat.num_inc_gc}</td>
                                            <td>{stat.heap_compactions}</td>
                                            <td>{stat.estimated_base}</td>
                                            <td>{stat.current_base}</td>
                                            <td>{stat.min}</td>
                                            <td>{stat.max}</td>
                                            <td>{stat.usage_trend}</td>
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

export default StatsReportTable;
