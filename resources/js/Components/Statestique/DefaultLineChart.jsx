import React from 'react'
import { useRevenueChart } from './hook/useRevenueChart'
import ReactApexChart from 'react-apexcharts'

const DefaultLineChart = () => {
    const { chartSeries, chartOptions } = useRevenueChart();
    
    return (
        <div className="col-md-6">
            <div className="card h-100 p-0">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Revenus par jour</h6>
                </div>
                <div className="card-body p-24">
                    <ReactApexChart 
                        id="defaultLineChart" 
                        className="apexcharts-tooltip-style-1" 
                        options={chartOptions} 
                        series={chartSeries} 
                        type="area"
                        height={264} 
                    />
                </div>
            </div>
        </div>
    )
}

export default DefaultLineChart