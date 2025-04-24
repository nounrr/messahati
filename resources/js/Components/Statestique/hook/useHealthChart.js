import { useState, useEffect } from 'react';
import axios from 'axios';

export const useHealthChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {}
    });

    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                const response = await axios.get('/api/HealthCore');
                console.log('Health API Response:', response.data);
                
                const { malades, non_malades } = response.data;

                // Format data for the chart
                const series = [{
                    name: "Patients",
                    data: [malades, non_malades]
                }];

                const options = {
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
                        categories: ['Malades', 'Non Malades'],
                        labels: {
                            style: {
                                colors: '#666',
                                fontSize: '12px'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: (value) => `${value}%`,
                            style: {
                                colors: '#666',
                                fontSize: '12px'
                            }
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (value) => `${value}%`
                        }
                    }
                };

                setChartData({ series, options });
            } catch (error) {
                console.error('Error fetching health data:', error);
                console.error('Error details:', error.response?.data);
            }
        };

        fetchHealthData();
    }, []);

    return chartData;
}; 