import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePaymentChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {}
    });

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const response = await axios.get('/api/payements');
                console.log('API Response:', response.data);
                
                const { totaux_par_jour } = response.data;
                console.log('Totaux par jour:', totaux_par_jour);

                // Format data for the chart
                const series = [{
                    name: "Paiements",
                    data: totaux_par_jour.map(item => item.total)
                }];
                console.log('Formatted series:', series);

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
                        categories: totaux_par_jour.map(item => item.jour),
                        labels: {
                            style: {
                                colors: '#666',
                                fontSize: '12px'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: (value) => `${value} €`,
                            style: {
                                colors: '#666',
                                fontSize: '12px'
                            }
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (value) => `${value} €`
                        }
                    }
                };
                console.log('Chart options:', options);

                setChartData({ series, options });
            } catch (error) {
                console.error('Error fetching payment data:', error);
                console.error('Error details:', error.response?.data);
            }
        };

        fetchPaymentData();
    }, []);

    return chartData;
}; 