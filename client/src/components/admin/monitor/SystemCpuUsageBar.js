import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Subscription } from "react-apollo"
import { GET_SYSTEM_CPU_USAGE_SUBSCRIPTION } from "../../../Queries";

class SystemCpuUsageBar extends React.Component {
    constructor(props){
        super(props)
        this.chartDataCores = {}
        this.chartData = {
            labels: [],
            datasets: [
                {
                    label: 'CPU Usage',
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
    }
    render(){
        return (
            <Subscription
                subscription={GET_SYSTEM_CPU_USAGE_SUBSCRIPTION}
            >
                {({ data, loading, error }) => {
                    if (loading) return loading;
                    if (error) return error.message;
                    let cpu = data.getSystemCpuUsage;
                    if (this.chartDataCores[cpu.core] === undefined){
                        console.log(cpu.core)
                        let i = this.chartData.labels.push(`core-${cpu.core}`) - 1;
                        this.chartData.datasets[0].data.push(Math.round(cpu.percent))
                        this.chartDataCores[cpu.core] = i;
                    } else {
                        let i = this.chartDataCores[cpu.core]
                        this.chartData.datasets[0].data[i] = cpu.percent;
                    }
                    this.chartReference && this.chartReference.chartInstance.update();
                    return (
                        <div>
                            <h2>CPU Usage</h2>
                            <Bar
                                ref={(reference) => {
                                    this.chartReference = reference
                                }}
                                data={this.chartData}
                                options={{
                                    events: ["click"],
                                    scales: {
                                        yAxes: [{
                                            display: true,
                                            ticks: {
                                                beginAtZero: true,
                                                suggestedMax: 100
                                            }
                                        }]
                                    }
                                }}
                            />
                        </div>
                    )
                }}
            </Subscription>
        )
    }
}

export default SystemCpuUsageBar;