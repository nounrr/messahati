import React from 'react'
import { useHealthChart } from './hook/useHealthChart'
import ReactApexChart from 'react-apexcharts'

const HealthLineChart = () => {
    const { series, options } = useHealthChart()
    
    // Valeurs par défaut si les données ne sont pas encore chargées
    const defaultSeries = [{
        name: "Patients",
        data: [0, 0]
    }];
    
    const defaultOptions = {
        chart: {
            height: 264,
            type: "line",
            toolbar: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        xaxis: {
            categories: ['Malades', 'Non Malades']
        }
    };

    return (
        <div className="col-md-6">
            <div className="card h-100 p-0">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">État de santé des patients</h6>
                </div>
                <div className="card-body p-24">
                    <ReactApexChart 
                        id="healthLineChart" 
                        options={options || defaultOptions} 
                        series={series || defaultSeries} 
                        type="line"
                        height={264} 
                    />
                </div>
            </div>
        </div>
    )
}

export default HealthLineChart 