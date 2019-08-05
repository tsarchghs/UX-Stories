import React from "react";
import { Subscription } from "react-apollo"
import { GET_SYSTEM_CPU_USAGE_SUBSCRIPTION } from "../../../Queries";

//  todo
class SystemCpuUsage extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
                <Subscription
                    subscription={GET_SYSTEM_CPU_USAGE_SUBSCRIPTION}
                >
                {({ data, loading, error }) => {
                    return (
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="card">
                                <div style={{ marginTop: "20px", marginRight: "20px" }}>
                                    <h5 className="card-header">List of all cores</h5>
                                </div>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Model</th>
                                                <th scope="col">Speed</th>
                                                <th scope="col">Percent</th>
                                                <th scope="col">idle</th>
                                                <th scope="col">nice</th>
                                                <th scope="col">user</th>
                                                <th scope="col">sys</th>
                                                <th scope="col">irq</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(this.state.chartDataCores).map(key => {
                                                    let cpu = this.state.chartDataCores[key].cpu;
                                                    return (
                                                        <tr>
                                                            <th scope="row">{cpu.core}</th>
                                                            <td>{cpu.model}</td>
                                                            <td>{cpu.speed}</td>
                                                            <td>{cpu.percent}%</td>
                                                            <td>{cpu.times.idle}</td>
                                                            <td>{cpu.times.nice}</td>
                                                            <td>{cpu.times.user}</td>
                                                            <td>{cpu.times.sys}</td>
                                                            <td>{cpu.times.irq}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }}
            </Subscription>
        )
    }
}

export default SystemCpuUsage;