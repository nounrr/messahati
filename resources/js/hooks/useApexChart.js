import { useState, useEffect } from 'react';
import { useAxios } from './useAxios';

export const useApexChart = () => {
    const { request } = useAxios();
    const [chartData, setChartData] = useState({
        series: [],
        options: {}
    });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const data = await request('GET', '/revenus');
                
                // Transformer les données pour le graphique
                const series = [{
                    name: 'Revenus',
                    data: data.map(item => item.revenu_net)
                }];
                
                const options = {
                    chart: {
                        height: 350,
                        type: 'area',
                        toolbar: {
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: data.map(item => item.date)
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy'
                        }
                    }
                };

                setChartData({
                    series,
                    options
                });
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
    }, [request]);

    return chartData;
}; 