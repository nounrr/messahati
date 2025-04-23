import { useState, useEffect } from 'react';
import { useAxios } from '../../../hooks/useAxios';

export const useStatistiques = () => {
    const { request } = useAxios();
    const [statistiques, setStatistiques] = useState({
        revenus: { series: [], options: {} },
        consultations: { series: [], options: {} },
        traitements: { series: [], options: {} },
        departements: { series: [], options: {} },
        age: { series: [], options: {} },
        paiements: { series: [], options: {} },
        sante: { series: [], options: {} }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupérer les revenus
                const revenusData = await request('GET', '/revenus');
                const revenusSeries = [
                    {
                        name: 'Revenus nets',
                        data: revenusData.map(item => item.revenu_net)
                    },
                    {
                        name: 'Crédits',
                        data: revenusData.map(item => item.credit)
                    },
                    {
                        name: 'Débits',
                        data: revenusData.map(item => item.debit)
                    }
                ];
                const revenusOptions = {
                    chart: {
                        type: 'line',
                        height: 350,
                        toolbar: { show: true },
                        zoom: { enabled: true }
                    },
                    dataLabels: { enabled: true },
                    stroke: { 
                        curve: 'smooth',
                        width: 2
                    },
                    colors: ['#2E93fA', '#66DA26', '#FF4560'],
                    xaxis: {
                        type: 'datetime',
                        categories: revenusData.map(item => item.date),
                        labels: {
                            format: 'dd/MM'
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Montant (DH)'
                        },
                        labels: {
                            formatter: (value) => `${value} DH`
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (value) => `${value} DH`
                        }
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right'
                    }
                };

                // Récupérer les consultations
                const consultationsData = await request('GET', '/consultations-par-jour');
                const consultationsSeries = [{
                    name: 'Consultations',
                    data: consultationsData.map(item => item.total)
                }];
                const consultationsOptions = {
                    chart: {
                        type: 'line',
                        height: 350
                    },
                    xaxis: {
                        categories: consultationsData.map(item => item.jour)
                    }
                };

                // Récupérer les traitements par heure
                const traitementData = await request('GET', '/rdv-par-heure-Traitemant');
                const traitementSeries = traitementData.reduce((acc, curr) => {
                    const typeIndex = acc.findIndex(series => series.name === curr.type);
                    if (typeIndex === -1) {
                        acc.push({
                            name: curr.type,
                            data: new Array(11).fill(0) // 8h to 18h (11 hours)
                        });
                        acc[acc.length - 1].data[curr.heure - 8] = curr.total;
                    } else {
                        acc[typeIndex].data[curr.heure - 8] = curr.total;
                    }
                    return acc;
                }, []);

                const traitementOptions = {
                    chart: {
                        type: 'bar',
                        height: 350,
                        stacked: true,
                        toolbar: {
                            show: true
                        },
                        zoom: {
                            enabled: true
                        }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            borderRadius: 10,
                            dataLabels: {
                                total: {
                                    enabled: true,
                                    style: {
                                        fontSize: '13px',
                                        fontWeight: 900
                                    }
                                }
                            }
                        },
                    },
                    xaxis: {
                        categories: Array.from({length: 11}, (_, i) => `${i + 8}h`),
                        title: {
                            text: 'Heures de la journée'
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Nombre de traitements'
                        }
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    fill: {
                        opacity: 1
                    }
                };

                // Récupérer les départements
                const departementsData = await request('GET', '/departement');
                const departementsSeries = departementsData.map(item => parseFloat(item.pourcentage) || 0);
                const departementsOptions = {
                    chart: {
                        type: 'pie',
                        height: 350
                    },
                    labels: departementsData.map(item => item.departement),
                    series: departementsSeries,
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center'
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function (val) {
                            return Math.round(val) + '%';
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function(val) {
                                return Math.round(val) + '%';
                            }
                        }
                    },
                    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                };

                // Récupérer les données d'âge
                const ageData = await request('GET', '/patientsAge');
                const ageSeries = [ageData.hommes, ageData.femmes, ageData.enfants];
                const ageOptions = {
                    chart: {
                        type: 'donut',
                        height: 350,
                        toolbar: { show: false }
                    },
                    labels: ['Hommes', 'Femmes', 'Enfants'],
                    legend: {
                        position: 'bottom'
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function (val) {
                            return val.toFixed(1) + "%"
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function(value) {
                                return value.toFixed(1) + "%"
                            }
                        }
                    },
                    colors: ['#008FFB', '#00E396', '#FEB019'],
                    plotOptions: {
                        pie: {
                            donut: {
                                labels: {
                                    show: true,
                                    total: {
                                        show: true,
                                        label: 'Total',
                                        formatter: function (w) {
                                            if (!w || !w.globals || !w.globals.seriesTotals) {
                                                return '0%';
                                            }
                                            const total = w.globals.seriesTotals.reduce((a, b) => {
                                                const numA = typeof a === 'number' ? a : 0;
                                                const numB = typeof b === 'number' ? b : 0;
                                                return numA + numB;
                                            }, 0);
                                            return typeof total === 'number' ? total.toFixed(1) + '%' : '0%';
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                // Récupérer les paiements
                const paiementsData = await request('GET', '/payements');
                const paiementsSeries = [{
                    name: 'Paiements',
                    data: paiementsData.totaux_par_jour.map(item => item.total)
                }];
                const paiementsOptions = {
                    chart: {
                        type: 'line',
                        height: 350
                    },
                    xaxis: {
                        categories: paiementsData.totaux_par_jour.map(item => item.jour)
                    }
                };

                // Récupérer les données de santé
                const santeData = await request('GET', '/HealthCore');
                const santeSeries = [{
                    name: 'Pourcentage',
                    data: [santeData.patients_health_rate, santeData.patients_sick_rate]
                }];
                const santeOptions = {
                    chart: {
                        type: 'radialBar',
                        height: 350
                    },
                    labels: ['En bonne santé', 'Malades']
                };

                setStatistiques({
                    revenus: { series: revenusSeries, options: revenusOptions },
                    consultations: { series: consultationsSeries, options: consultationsOptions },
                    traitements: { series: traitementSeries, options: traitementOptions },
                    departements: { series: departementsSeries, options: departementsOptions },
                    age: { series: ageSeries, options: ageOptions },
                    paiements: { series: paiementsSeries, options: paiementsOptions },
                    sante: { series: santeSeries, options: santeOptions }
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData();
    }, [request]);

    return statistiques;
}; 