import React from 'react'
import { useStatistiques } from './hook/useStatistiques'
import ReactApexChart from 'react-apexcharts'

const LineDataLabel = () => {
    const { departements } = useStatistiques();
    
    return (
        <div className="col-md-6">
            <div className="card h-100 p-0">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">
                        Répartition par département
                    </h6>
                </div>
                <div className="card-body p-24">
                    <ReactApexChart 
                        id="lineDataLabel" 
                        options={departements.options} 
                        series={departements.series} 
                        type="pie"
                        height={264} 
                    />
                </div>
            </div>
        </div>
    )
}

export default LineDataLabel