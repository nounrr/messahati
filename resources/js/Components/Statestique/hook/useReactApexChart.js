import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from 'react';
import { useAxios } from '../../../hooks/useAxios';

const useReactApexChart = () => {
  const { request } = useAxios();
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Revenus nets",
        data: []
      },
      {
        name: "Crédits",
        data: []
      },
      {
        name: "Débits",
        data: []
      }
    ],
        options: {
          chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
        }
      },
        dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
        width: 2,
      },
      colors: ['#2E93fA', '#66DA26', '#FF4560'],
    xaxis: {
        type: 'datetime',
        categories: [],
      labels: {
          format: 'dd/MM'
        }
      },
      yaxis: {
      title: {
          text: 'Montant (DH)'
        }
    },
    tooltip: {
        x: {
          format: 'dd/MM/yy'
      },
      y: {
          formatter: function(value) {
            return value + " DH"
          }
        }
      },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request('GET', '/revenus');
        setChartData({
          series: [
            {
              name: "Revenus nets",
              data: data.map(item => item.revenu_net)
            },
            {
              name: "Crédits",
              data: data.map(item => item.credit)
            },
            {
              name: "Débits",
              data: data.map(item => item.debit)
            }
          ],
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

export default useReactApexChart;
