import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Subscription } from "react-apollo"
import { GET_MEMORY_USAGE_SUBSCRIPTION } from "../../../Queries";
import "../../../lib/chartSetup";

class MemoryUsagePie extends React.Component {
    constructor(props){
        super(props)
        this.chartData = {
            labels: [
                'Free',
                'Used',
            ],
            datasets: [{
                data: [0, 0],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        }
    }
    render(){
        return (
            <Subscription
                subscription={GET_MEMORY_USAGE_SUBSCRIPTION}
            >
                {({ data, loading, error }) => {
                    if (loading) return loading;
                    if (error) return error.message;
                    let freeMemory = data.getMemoryUsage.freeMemory;
                    let totalMemory = data.getMemoryUsage.totalMemory;
                    if (
                        this.chartData.datasets[0].data[0] !== freeMemory
                    ) {
                        this.chartData.datasets[0].data[0] = freeMemory;
                        this.chartData.datasets[0].data[1] = totalMemory - freeMemory;
                    }
                    return (
                        <div style={{width: "50%", height: "50%"}}>
                            <h2>Memory Usage - {Math.round(totalMemory - freeMemory)}MB/{Math.round(totalMemory)}MB</h2>
                            <Pie data={this.chartData} />
                        </div>
                    )
                }}
            </Subscription>
        )
    }
}

export default MemoryUsagePie;
