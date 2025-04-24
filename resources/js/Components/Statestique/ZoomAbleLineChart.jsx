import React from 'react'
import { useStatistiques } from './hook/useStatistiques'
import ReactApexChart from 'react-apexcharts'

const ZoomAbleLineChart = () => {
    const { consultations } = useStatistiques();
    
    return (
        <div className="col-md-6">
            <div className="card h-100 p-0">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Consultations par jour</h6>
                </div>
                <div className="card-body p-24">
                    <ReactApexChart 
                        id="zoomAbleLineChart" 
                        options={consultations.options} 
                        series={consultations.series} 
                        type="line"
                        height={264} 
                    />
                </div>
            </div>
        </div>
    )
}

export default ZoomAbleLineChart