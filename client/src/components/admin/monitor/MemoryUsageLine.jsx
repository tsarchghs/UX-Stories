import React from 'react';
import { Line } from 'react-chartjs-2';
import { Subscription } from "react-apollo"
import { GET_MEMORY_USAGE_SUBSCRIPTION } from "../../../Queries";
import "../../../lib/chartSetup";

class MemoryUsageLine extends React.Component {
    constructor(props) {
        super(props)
        this.chartData = {
            labels: [],
            datasets: [
                {
                    label: 'Memory Usage',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                }
            ]
        }
        this.allowUpdate = true;
    }
    render() {
        return (
            <Subscription
                subscription={GET_MEMORY_USAGE_SUBSCRIPTION}
            >
                {({ data, loading, error }) => {
                    if (loading) return loading;
                    if (error) return error.message;
                    let freeMemory = data.getMemoryUsage.freeMemory;
                    let totalMemory = data.getMemoryUsage.totalMemory;
                    let currentData = this.chartData.datasets[0].data;
                    let lastData = currentData.length ? currentData[currentData.length - 1] : 0;
                    if (
                        this.allowUpdate && (
                            Math.abs(lastData - (totalMemory - freeMemory)) > 50 ||
                            this.chartData.labels.length < 10
                        )

                    ) {
                        this.allowUpdate = false;
                        if (this.chartData.labels.length > 10) {
                            this.chartData.labels.shift();
                            this.chartData.datasets[0].data.shift();
                        }
                        let currentTime = new Date();
                        let time = `${currentTime.getHours()}:${currentTime.getMinutes()}`
                        this.chartData.labels.push(time)
                        this.chartData.datasets[0].data.push(totalMemory - freeMemory);
                        window.setTimeout(() => this.allowUpdate = true, 500)
                        this.chartReference && this.chartReference.update()
                    }
                    return (
                        <div style={{ width: "50%", height: "50%", marginTop: 40}}>
                            <Line 
                                options={{
                                    events: ["click"],
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            suggestedMax: totalMemory
                                        }
                                    }
                                }}
                                ref={(reference) => this.chartReference = reference}
                                data={this.chartData}
                            />
                            Updated only when difference between last stats is x {" > "} 50
                        </div>
                    )
                }}
            </Subscription>
        )
    }
}

export default MemoryUsageLine;
