import React from 'react'
import { usePaymentChart } from './hook/usePaymentChart'
import ReactApexChart from 'react-apexcharts'

const DoubleLineChart = () => {
    const { series, options } = usePaymentChart()
    
    // Valeurs par défaut si les données ne sont pas encore chargées
    const defaultSeries = [{
        name: "Paiements",
        data: [0]
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
            categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        }
    };

    return (
        <div className="col-md-6">
            <div className="card h-100 p-0">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Paiements par jour</h6>
                </div>
                <div className="card-body p-24">
                    <ReactApexChart 
                        id="doubleLineChart" 
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

export default DoubleLineChart