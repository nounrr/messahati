import { useState, useEffect } from 'react';
import { useAxios } from '../../../hooks/useAxios';

export const useRevenueChart = () => {
  const { request } = useAxios();
  const [chartData, setChartData] = useState({
    series: [{
      name: "Revenus",
      data: []
    }],
    options: {
      chart: {
        height: 264,
        type: "line",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
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
        type: 'datetime',
        categories: []
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy'
        }
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request('GET', '/statistiques/revenus');
        setChartData({
          series: [{
            name: "Revenus",
            data: data.map(item => item.revenu_net)
          }],
          options: {
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories: data.map(item => item.date)
            }
          }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  return {
    chartSeries: chartData.series,
    chartOptions: chartData.options
  };
}; 