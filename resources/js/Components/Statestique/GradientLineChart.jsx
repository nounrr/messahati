import React from 'react'
import { useStatistiques } from './hook/useStatistiques'
import ReactApexChart from 'react-apexcharts'

const GradientLineChart = () => {
    const { age } = useStatistiques();
    
    return (
        <div className="col-md-6">
            <div className="card h-100 p-0">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Répartition par âge</h6>
                </div>
                <div className="card-body p-24">
                    <ReactApexChart 
                        id="gradientLineChart" 
                        options={age.options} 
                        series={age.series} 
                        type="donut"
                        height={264} 
                    />
                </div>
            </div>
        </div>
    )
}

export default GradientLineChart